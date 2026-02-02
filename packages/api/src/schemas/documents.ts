import { z } from "zod";
import { MAX_POMODOROS_PER_TASK } from "@hemera/shared";

const nonEmptyString = z.string().min(1);
const boundedPomodoros = z.number().int().min(0).max(MAX_POMODOROS_PER_TASK);

export const DayStartSchema = z.object({
  slept8Hours: z.boolean(),
  water3Glasses: z.boolean(),
  meditation5Min: z.boolean(),
  mobility5Min: z.boolean(),
  gratefulFor: nonEmptyString,
  intentionForDay: nonEmptyString
});

export const OneThingSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  pomodorosPlanned: boundedPomodoros,
  pomodorosDone: boundedPomodoros
});

export const TopThreeItemSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  pomodorosPlanned: boundedPomodoros,
  pomodorosDone: boundedPomodoros
});

export const OtherTaskSchema = z.object({
  title: nonEmptyString,
  description: z.string().optional(),
  pomodorosPlanned: boundedPomodoros.optional(),
  pomodorosDone: boundedPomodoros.optional()
});

export const PlanningSchema = z.object({
  oneThing: OneThingSchema,
  topThree: z.array(TopThreeItemSchema).length(3),
  otherTasks: z.array(OtherTaskSchema).optional()
});

export const LifePillarsSchema = z.object({
  training: z.boolean(),
  deepRelaxation: z.boolean(),
  healthyNutrition: z.boolean(),
  realConnection: z.boolean()
});

export const ReflectionSchema = z.object({
  wentWell: nonEmptyString,
  whyWentWell: nonEmptyString,
  repeatInFuture: nonEmptyString,
  wentWrong: nonEmptyString,
  whyWentWrong: nonEmptyString,
  doDifferently: nonEmptyString
});

export const DayCloseSchema = z.object({
  noScreens2Hours: z.boolean(),
  noCarbs3Hours: z.boolean(),
  tomorrowPlanned: z.boolean(),
  goalsReviewed: z.boolean(),
  reflection: ReflectionSchema
});

export const DayContentSchema = z.object({
  dayStart: DayStartSchema,
  planning: PlanningSchema,
  lifePillars: LifePillarsSchema,
  dayClose: DayCloseSchema
});

const weeklyGoalSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
  linkedMonthGoals: z.array(nonEmptyString).min(1),
  progress: z.number().int().min(0).max(100)
});

export const WeekContentSchema = z.object({
  weeklyGoals: z.array(weeklyGoalSchema)
});

const monthlyGoalSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  description: nonEmptyString,
  linkedQuarterGoals: z.array(nonEmptyString).min(1),
  progress: z.number().int().min(0).max(100)
});

export const MonthContentSchema = z.object({
  monthlyGoals: z.array(monthlyGoalSchema)
});

export const LifeWheelSchema = z.object({
  work: z.number().int().min(1).max(10),
  fun: z.number().int().min(1).max(10),
  social: z.number().int().min(1).max(10),
  giving: z.number().int().min(1).max(10),
  money: z.number().int().min(1).max(10),
  growth: z.number().int().min(1).max(10),
  health: z.number().int().min(1).max(10),
  love: z.number().int().min(1).max(10)
});

export const QuarterGoalSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString,
  smartDefinition: nonEmptyString,
  whatIsDifferent: nonEmptyString,
  consequencesIfNot: nonEmptyString,
  rewardIfAchieved: nonEmptyString,
  progress: z.number().int().min(0).max(100)
});

export const QuarterContentSchema = z.object({
  lifeWheel: LifeWheelSchema,
  quarterGoals: z.array(QuarterGoalSchema).length(3)
});

export const documentParamsSchema = z.object({
  docType: z.enum(["day", "week", "month", "quarter"]),
  docKey: nonEmptyString
});

export const documentUpdateSchema = z.object({
  content: z.record(z.unknown()),
  clientUpdatedAt: z.string().datetime(),
  deviceId: z.string().min(1).optional()
});

export const closeDaySchema = z.object({
  reflection: ReflectionSchema
});

export const documentListQuerySchema = z.object({
  docType: z.enum(["day", "week", "month", "quarter"]).optional(),
  since: z.string().datetime().optional()
});
