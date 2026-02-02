// routes/auth.ts
import { Hono } from "hono";
import { hashPassword, comparePassword } from "../utils/hash";

const app = new Hono();

app.post("/register", async (c) => {
  const { email, password } = await c.req.json();

  const hash = await hashPassword(password);

  await c.env.DB.prepare(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)"
  )
    .bind(email, hash)
    .run();

  return c.json({ success: true });
});

app.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await c.env.DB
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!user) return c.json({ error: "Invalid login" }, 401);

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return c.json({ error: "Invalid login" }, 401);

  return c.json({ userId: user.id });
});

export default app;
