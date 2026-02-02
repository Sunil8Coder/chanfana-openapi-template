// routes/resume.ts
import { Hono } from "hono";

const resumeRouter = new Hono();

resumeRouter.post("/", async (c) => {
  const { userId, title, template, resumeData } = await c.req.json();

  await c.env.DB.prepare(
    `INSERT INTO resumes (user_id, title, template, resume_data)
     VALUES (?, ?, ?, ?)`
  )
    .bind(userId, title, template, JSON.stringify(resumeData))
    .run();

  return c.json({ success: true });
});

resumeRouter.get("/:userId", async (c) => {
  const userId = c.req.param("userId");

  const resumes = await c.env.DB
    .prepare("SELECT * FROM resumes WHERE user_id = ?")
    .bind(userId)
    .all();

  return c.json(resumes.results);
});

export default resumeRouter;
