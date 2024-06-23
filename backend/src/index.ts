import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt';

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET_MESSAGE:string
  }
}>();

app.post('/api/v1/signup',async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
  const body = await c.req.json();
  const user = await prisma.user.create({
    data:{
      email: body.email,
      password: body.password
    }
  })
  if(!user){
    c.status(403);
    return c.json({
      error: "error while signup"
    })
  }
  const token = await sign({id: user.id}, c.env.JWT_SECRET_MESSAGE);
	return c.json({
    JWT: token
  })
})

app.post('/api/v1/signin', (c) => {
	return c.text('signin route')
})

app.get('/api/v1/blog/:id', (c) => {
	const id = c.req.param('id')
	console.log(id);
	return c.text('get blog route')
})

app.post('/api/v1/blog', (c) => {

	return c.text('signin route')
})

app.put('/api/v1/blog', (c) => {
	return c.text('signin route')
})

export default app;
