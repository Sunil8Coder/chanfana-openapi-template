import { Hono } from "hono";
import { z } from "zod";
import { ApiException } from "chanfana";

/**
 * Profile schema
 */
const ProfileSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
});

 const profileRouter =  new Hono();

/**
 * Get user profile
 * GET /profile/:userId
 */
profileRouter.get("/:userId", async (c) => {
  const userId = Number(c.req.param("userId"));

  if (Number.isNaN(userId)) {
    throw new ApiException(400, [
      { code: 4001, message: "Invalid userId" },
    ]);
  }

  const profile = await c.env.DB
    .prepare("SELECT * FROM profiles WHERE user_id = ?")
    .bind(userId)
    .first();

  if (!profile) {
    return c.json({ success: true, data: null });
  }

  return c.json({ success: true, data: profile });
});

/**
 * Create or update profile
 * POST /profile/:userId
 */
profileRouter.post("/:userId", async (c) => {
  const userId = Number(c.req.param("userId"));
  const body = await c.req.json();

  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiException(400, [
      { code: 4002, message: "Invalid profile payload" },
    ]);
  }

  const { fullName, phone, location, summary } = parsed.data;

  const existing = await c.env.DB
    .prepare("SELECT id FROM profiles WHERE user_id = ?")
    .bind(userId)
    .first();

  if (existing) {
    await c.env.DB
      .prepare(
        `UPDATE profiles
         SET full_name = ?, phone = ?, location = ?, summary = ?
         WHERE user_id = ?`
      )
      .bind(fullName, phone, location, summary, userId)
      .run();
  } else {
    await c.env.DB
      .prepare(
        `INSERT INTO profiles (user_id, full_name, phone, location, summary)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(userId, fullName, phone, location, summary)
      .run();
  }

  return c.json({ success: true });
});

export default profileRouter;
