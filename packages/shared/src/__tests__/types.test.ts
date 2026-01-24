import { describe, expect, it } from "vitest";
import {
  ApiResponse,
  AccountabilityPair,
  DailyCheckin,
  DailyStatusSummary,
  DocStatus,
  DocType,
  DocumentBase,
  ErrorCode,
  MonthStartContent,
  QuarterStartContent,
  SubscriptionStatus,
  TaskItem,
  UserSettings,
  WeekStartContent
} from "../index";

describe("shared types", () => {
  it("creates valid objects", () => {
    const settings: UserSettings = {
      notificationPreferences: {
        dayStartReminder: true,
        dayCloseReminder: true,
        pomodoroReminders: true,
        accountabilityCheckins: false
      },
      timezone: "Europe/Amsterdam"
    };

    const task: TaskItem = {
      title: "Write overview",
      description: "Draft outline",
      pomodorosPlanned: 2,
      pomodorosDone: 1
    };

    const document: DocumentBase = {
      id: "doc-1",
      userId: "user-1",
      docType: DocType.Day,
      docKey: "2026-01-24",
      schemaVersion: 1,
      status: DocStatus.Open,
      content: { summary: "" },
      clientUpdatedAt: new Date().toISOString(),
      serverReceivedAt: new Date().toISOString(),
      deviceId: "device-1"
    };

    const pair: AccountabilityPair = {
      id: "pair-1",
      userAId: "user-a",
      userBId: "user-b",
      createdAt: new Date().toISOString()
    };

    const checkin: DailyCheckin = {
      id: "checkin-1",
      pairId: "pair-1",
      authorUserId: "user-a",
      targetDate: "2026-01-24",
      message: "Great job today",
      createdAt: new Date().toISOString()
    };

    const summary: DailyStatusSummary = {
      userId: "user-b",
      date: "2026-01-24",
      dayClosed: false,
      oneThingDone: false,
      reflectionPresent: false,
      updatedAt: new Date().toISOString()
    };

    const week: WeekStartContent = {
      focusTheme: "Momentum",
      keyOutcomes: ["Ship core API"],
      obstacles: ["Time"],
      supportNeeded: ["Accountability"],
      weeklyHabits: ["Daily review"]
    };

    const month: MonthStartContent = {
      focusTheme: "Consistency",
      keyOutcomes: ["20 journal entries"],
      growthAreas: ["Sleep"],
      risks: ["Travel"],
      monthlyHabits: ["Morning review"]
    };

    const quarter: QuarterStartContent = {
      vision: "Build Hemera MVP",
      keyOutcomes: ["Launch beta"],
      strategicProjects: ["Mobile app"],
      risks: ["Scope"],
      successMetrics: ["100 active users"]
    };

    const response: ApiResponse<{ ok: boolean }> = {
      success: true,
      data: { ok: true }
    };

    expect(settings.timezone).toBe("Europe/Amsterdam");
    expect(task.pomodorosPlanned).toBe(2);
    expect(document.status).toBe(DocStatus.Open);
    expect(pair.id).toBe("pair-1");
    expect(checkin.message).toBe("Great job today");
    expect(summary.dayClosed).toBe(false);
    expect(week.focusTheme).toBe("Momentum");
    expect(month.focusTheme).toBe("Consistency");
    expect(quarter.vision).toBe("Build Hemera MVP");
    expect(response.success).toBe(true);

    const subscription: SubscriptionStatus = SubscriptionStatus.Free;
    const errorCode: ErrorCode = ErrorCode.Unauthorized;

    expect(subscription).toBe("free");
    expect(errorCode).toBe("UNAUTHORIZED");
  });

  it("rejects invalid objects", () => {
    // @ts-expect-error missing notification preferences
    const badSettings: UserSettings = {
      timezone: "UTC"
    };

    // @ts-expect-error invalid doc type
    const badDocument: DocumentBase = {
      id: "doc-1",
      userId: "user-1",
      docType: "year",
      docKey: "2026",
      schemaVersion: 1,
      status: DocStatus.Open,
      content: {},
      clientUpdatedAt: "",
      serverReceivedAt: ""
    };

    expect(badSettings).toBeDefined();
    expect(badDocument).toBeDefined();
  });
});
