import { getSupabaseAdminClient } from "./client";

const testUsers = [
  {
    email: "hemera.test+alpha@example.com",
    password: "TestPassword!123"
  },
  {
    email: "hemera.test+beta@example.com",
    password: "TestPassword!123"
  }
];

async function createTestUser(email: string, password: string) {
  const admin = getSupabaseAdminClient();
  const { data: existing } = await admin.auth.admin.listUsers();
  const user = existing?.users.find((entry) => entry.email === email);
  if (user) {
    return user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });
  if (error || !data.user) {
    throw new Error(error?.message ?? "Failed to create user");
  }
  return data.user;
}

async function run() {
  const admin = getSupabaseAdminClient();
  const userA = await createTestUser(testUsers[0].email, testUsers[0].password);
  const userB = await createTestUser(testUsers[1].email, testUsers[1].password);

  const now = new Date().toISOString();

  await admin.from("journal_documents").upsert([
    {
      user_id: userA.id,
      doc_type: "quarter",
      doc_key: "2026-Q1",
      schema_version: 1,
      status: "active",
      content: { vision: "Ship MVP", keyOutcomes: ["Launch beta"] },
      client_updated_at: now,
      device_id: "seed"
    },
    {
      user_id: userA.id,
      doc_type: "month",
      doc_key: "2026-01",
      schema_version: 1,
      status: "active",
      content: { focusTheme: "Consistency" },
      client_updated_at: now,
      device_id: "seed"
    },
    {
      user_id: userA.id,
      doc_type: "week",
      doc_key: "2026-W04",
      schema_version: 1,
      status: "active",
      content: { focusTheme: "Momentum" },
      client_updated_at: now,
      device_id: "seed"
    }
  ]);

  await admin.from("journal_documents").upsert([
    {
      user_id: userA.id,
      doc_type: "day",
      doc_key: "2026-01-23",
      schema_version: 1,
      status: "closed",
      content: { dayStart: {}, planning: {}, lifePillars: {}, dayClose: {} },
      client_updated_at: now,
      device_id: "seed"
    },
    {
      user_id: userA.id,
      doc_type: "day",
      doc_key: "2026-01-24",
      schema_version: 1,
      status: "open",
      content: { dayStart: {}, planning: {}, lifePillars: {}, dayClose: {} },
      client_updated_at: now,
      device_id: "seed"
    },
    {
      user_id: userA.id,
      doc_type: "day",
      doc_key: "2026-01-22",
      schema_version: 1,
      status: "auto_closed",
      content: { dayStart: {}, planning: {}, lifePillars: {}, dayClose: {} },
      client_updated_at: now,
      device_id: "seed"
    }
  ]);

  const { data: pair, error: pairError } = await admin
    .from("accountability_pairs")
    .upsert({
      user_a_id: [userA.id, userB.id].sort()[0],
      user_b_id: [userA.id, userB.id].sort()[1]
    })
    .select("id")
    .single();

  if (pairError || !pair) {
    throw new Error(pairError?.message ?? "Failed to create accountability pair");
  }

  await admin.from("accountability_daily_checkins").upsert([
    {
      pair_id: pair.id,
      author_user_id: userA.id,
      target_date: "2026-01-24",
      message: "Made solid progress today"
    },
    {
      pair_id: pair.id,
      author_user_id: userB.id,
      target_date: "2026-01-24",
      message: "Wrapped up day close"
    }
  ]);

  console.log("Seed data created");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
