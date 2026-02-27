import { describe, expect, it, vi } from "vitest";
import { DocType } from "../../types/documents";
import { MAX_RETRIES, getNextRetryDelay } from "../retryStrategy";
import { OutboxManager } from "../outbox";
import { SyncManager } from "../syncManager";

const baseMutation = {
  id: "mutation-1",
  docType: DocType.Day,
  docKey: "2026-02-02",
  content: { summary: "Daily notes" },
  clientUpdatedAt: new Date().toISOString(),
  deviceId: "device-a",
  operation: "upsert" as const
};

describe("retryStrategy", () => {
  it("calculates exponential backoff with cap", () => {
    expect(getNextRetryDelay(0)).toBe(1000);
    expect(getNextRetryDelay(1)).toBe(2000);
    expect(getNextRetryDelay(2)).toBe(4000);
    expect(getNextRetryDelay(10)).toBe(5 * 60 * 1000);
  });

  it("tracks retry counts and max retries", async () => {
    const outbox = new OutboxManager();
    await outbox.add(baseMutation);

    for (let i = 0; i < MAX_RETRIES; i += 1) {
      await outbox.markFailed(baseMutation.id);
    }

    const items = await outbox.getAll();
    expect(items[0].retryCount).toBe(MAX_RETRIES);
    expect(outbox.shouldRetry(items[0])).toBe(false);
  });

  it("holds sync when offline", async () => {
    const client = {
      push: vi.fn(),
      pull: vi.fn()
    } as unknown as {
      push: () => Promise<unknown>;
      pull: () => Promise<unknown>;
    };
    const outbox = new OutboxManager();
    const networkStatus = {
      isOnline: () => false,
      onChange: () => () => {}
    };
    const manager = new SyncManager(client as never, outbox, undefined, undefined, networkStatus);

    await outbox.add(baseMutation);
    await manager.sync();

    expect(client.push).not.toHaveBeenCalled();
    expect(client.pull).not.toHaveBeenCalled();
    expect(manager.getSyncStatus()).toBe("pending");
  });
});
