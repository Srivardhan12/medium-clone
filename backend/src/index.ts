import { Hono } from 'hono';
import userRouter from './routes/user';
import blogRouter from './routes/blog';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET_MESSAGE: string
  }
}>();

app.use('/api/v1/blog/*', async (c, next) => {
  const header = c.req.header('authorization');
  if (!header) {
    c.status(403);
    return c.json({
      error: "unauthorized"
    })
  }
  const token = header.split(" ")[1]

})

app.route('/api/vi/user', userRouter)
app.route('/api/vi/blog', blogRouter)

export default app;
