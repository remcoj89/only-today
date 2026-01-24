export enum DocType {
  Day = "day",
  Week = "week",
  Month = "month",
  Quarter = "quarter"
}

export enum DocStatus {
  Open = "open",
  Closed = "closed",
  AutoClosed = "auto_closed"
}

export type TaskItem = {
  title: string;
  description?: string;
  pomodorosPlanned: number;
  pomodorosDone: number;
};

export interface DocumentBase {
  id: string;
  userId: string;
  docType: DocType;
  docKey: string;
  schemaVersion: number;
  status: DocStatus | "active" | "archived";
  content: Record<string, unknown>;
  clientUpdatedAt: string;
  serverReceivedAt: string;
  deviceId?: string;
}

export interface DayContent {
  dayStart: {
    slept8Hours: boolean;
    water3Glasses: boolean;
    meditation5Min: boolean;
    mobility5Min: boolean;
    gratefulFor: string;
    intentionForDay: string;
  };
  planning: {
    oneThing: TaskItem;
    topThree: [TaskItem, TaskItem, TaskItem];
    otherTasks?: TaskItem[];
  };
  lifePillars: {
    training: boolean;
    deepRelaxation: boolean;
    healthyNutrition: boolean;
    realConnection: boolean;
  };
  dayClose: {
    noScreens2Hours: boolean;
    noCarbs3Hours: boolean;
    tomorrowPlanned: boolean;
    goalsReviewed: boolean;
    reflection: {
      wentWell: string;
      whyWentWell: string;
      repeatInFuture: string;
      wentWrong: string;
      whyWentWrong: string;
      doDifferently: string;
    };
  };
}

export interface WeekStartContent {
  focusTheme: string;
  keyOutcomes: string[];
  obstacles: string[];
  supportNeeded: string[];
  weeklyHabits: string[];
}

export interface MonthStartContent {
  focusTheme: string;
  keyOutcomes: string[];
  growthAreas: string[];
  risks: string[];
  monthlyHabits: string[];
}

export interface QuarterStartContent {
  vision: string;
  keyOutcomes: string[];
  strategicProjects: string[];
  risks: string[];
  successMetrics: string[];
}
