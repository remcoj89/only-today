import { describe, expect, it, vi } from "vitest";
import { DocType } from "../../types/documents";
import { OutboxManager } from "../outbox";
import { SyncManager } from "../syncManager";
import type { SyncClient } from "../syncClient";

const baseMutation = {
  id: "mutation-1",
  docType: DocType.Day,
  docKey: "2026-02-02",
  content: { summary: "Daily notes" },
  clientUpdatedAt: new Date().toISOString(),
  deviceId: "device-a",
  operation: "upsert" as const
};

function createMockClient(overrides?: Partial<SyncClient>): SyncClient {
  return {
    push: vi.fn(async () => ({ results: [{ id: baseMutation.id, success: true }] })),
    pull: vi.fn(async () => ({ documents: [], serverTime: new Date().toISOString() })),
    fullSync: vi.fn(async () => ({
      push: { results: [{ id: baseMutation.id, success: true }] },
      pull: { documents: [], serverTime: new Date().toISOString() }
    })),
    ...overrides
  } as SyncClient;
}

describe("SyncManager", () => {
  it("queues mutations in the outbox", async () => {
    const outbox = new OutboxManager();
    const client = createMockClient();
    const manager = new SyncManager(client, outbox);

    await manager.queueMutation(baseMutation);

    expect(await outbox.getPendingCount()).toBe(1);
    expect(manager.getSyncStatus()).toBe("pending");
  });

  it("pushes pending mutations and pulls updates", async () => {
    const outbox = new OutboxManager();
    const client = createMockClient();
    const manager = new SyncManager(client, outbox);

    await manager.queueMutation(baseMutation);
    await manager.sync();

    expect(client.push).toHaveBeenCalled();
    expect(client.pull).toHaveBeenCalled();
    expect(await outbox.getPendingCount()).toBe(0);
    expect(manager.getSyncStatus()).toBe("synced");
  });

  it("handles push errors gracefully", async () => {
    const outbox = new OutboxManager();
    const client = createMockClient({
      push: vi.fn(async () => {
        throw new Error("network");
      })
    });
    const manager = new SyncManager(client, outbox);

    await manager.queueMutation(baseMutation);
    await expect(manager.sync()).rejects.toThrow("network");

    expect(await outbox.getPendingCount()).toBe(1);
    expect(manager.getSyncStatus()).toBe("error");
  });

  it("supports auto-sync scheduling", async () => {
    vi.useFakeTimers();
    const outbox = new OutboxManager();
    const client = createMockClient();
    const manager = new SyncManager(client, outbox);
    const syncSpy = vi.spyOn(manager, "sync").mockResolvedValue();

    manager.startAutoSync(1000);
    await vi.advanceTimersByTimeAsync(3000);
    manager.stopAutoSync();

    expect(syncSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("notifies conflicts via handler", async () => {
    const outbox = new OutboxManager();
    const client = createMockClient({
      push: vi.fn(async () => ({
        results: [
          {
            id: baseMutation.id,
            success: true,
            conflictResolution: { winner: "existing" }
          }
        ]
      }))
    });
    const handler = vi.fn();
    const manager = new SyncManager(client, outbox, undefined, handler);

    await manager.queueMutation(baseMutation);
    await manager.sync();

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
