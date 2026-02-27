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
  MonthGoal,
  QuarterStartContent,
  QuarterGoal,
  SyncMutation,
  SyncPullRequest,
  SyncPullResponse,
  SyncPushRequest,
  SyncPushResponse,
  SyncMutationResult,
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
      weeklyGoals: [
        {
          id: "week-goal-1",
          title: "Ship core API",
          description: "Finish Phase 1",
          linkedMonthGoals: ["month-goal-1"],
          progress: 20
        }
      ]
    };

    const monthGoal: MonthGoal = {
      id: "month-goal-1",
      title: "Launch beta",
      description: "Prepare beta release",
      linkedQuarterGoals: ["quarter-goal-1"],
      progress: 10
    };

    const month: MonthStartContent = {
      monthlyGoals: [monthGoal]
    };

    const quarterGoal: QuarterGoal = {
      id: "quarter-goal-1",
      title: "Build Hemera MVP",
      smartDefinition: "Ship working backend by end of quarter",
      whatIsDifferent: "Consistent daily progress",
      consequencesIfNot: "Delayed launch",
      rewardIfAchieved: "Public beta",
      progress: 15
    };

    const quarter: QuarterStartContent = {
      lifeWheel: {
        work: 7,
        fun: 6,
        social: 5,
        giving: 4,
        money: 6,
        growth: 8,
        health: 7,
        love: 6
      },
      quarterGoals: [
        quarterGoal,
        { ...quarterGoal, id: "quarter-goal-2" },
        { ...quarterGoal, id: "quarter-goal-3" }
      ]
    };

    const response: ApiResponse<{ ok: boolean }> = {
      success: true,
      data: { ok: true }
    };

    const mutation: SyncMutation = {
      id: "mutation-1",
      docType: DocType.Day,
      docKey: "2026-01-24",
      content: { summary: "Daily notes" },
      clientUpdatedAt: new Date().toISOString(),
      deviceId: "device-1",
      operation: "upsert"
    };

    const pushRequest: SyncPushRequest = {
      mutations: [mutation]
    };

    const pushResult: SyncMutationResult = {
      id: mutation.id,
      success: true
    };

    const pushResponse: SyncPushResponse = {
      results: [pushResult]
    };

    const pullRequest: SyncPullRequest = {
      since: new Date().toISOString(),
      docTypes: [DocType.Day, DocType.Week]
    };

    const pullResponse: SyncPullResponse = {
      documents: [document],
      serverTime: new Date().toISOString()
    };

    expect(settings.timezone).toBe("Europe/Amsterdam");
    expect(task.pomodorosPlanned).toBe(2);
    expect(document.status).toBe(DocStatus.Open);
    expect(pair.id).toBe("pair-1");
    expect(checkin.message).toBe("Great job today");
    expect(summary.dayClosed).toBe(false);
    expect(week.weeklyGoals[0].title).toBe("Ship core API");
    expect(month.monthlyGoals[0].title).toBe("Launch beta");
    expect(quarter.lifeWheel.growth).toBe(8);
    expect(response.success).toBe(true);
    expect(pushRequest.mutations[0].operation).toBe("upsert");
    expect(pushResponse.results[0].success).toBe(true);
    expect(pullRequest.docTypes?.length).toBe(2);
    expect(pullResponse.documents[0].id).toBe("doc-1");

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

    const badDocument: DocumentBase = {
      id: "doc-1",
      userId: "user-1",
      // @ts-expect-error invalid doc type
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
