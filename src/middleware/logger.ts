
import { Context, Next } from "hono";

export const logger = async (c: Context, next: Next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;

  await c.env.DB.prepare(
    `INSERT INTO request_logs (method, path, ip, user_agent)
     VALUES (?, ?, ?, ?)`
  )
    .bind(
      c.req.method,
      c.req.path,
      c.req.header("cf-connecting-ip"),
      c.req.header("user-agent")
    )
    .run();

  console.log(
    `[${c.req.method}] ${c.req.path} - ${duration}ms`
  );
};
