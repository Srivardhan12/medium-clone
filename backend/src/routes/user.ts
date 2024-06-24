import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET_MESSAGE: string
    }
}>();

userRouter.post('/signup', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());
        const body = await c.req.json();
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password
            }
        })
        if (!user) {
            c.status(403);
            return c.json({
                error: "error while signup"
            })
        }
        const token = await sign({ id: user.id }, c.env.JWT_SECRET_MESSAGE);
        return c.json({
            JWT: token
        })
    } catch (error) {
        return c.json({ error })
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const user = await prisma.user.findUnique({
        where: {
            email: body.email
        }
    })

    if (!user) {
        c.status(403);
        return c.json({
            error: "user with this email already exist"
        })
    }
    const token = sign({ id: user.id }, c.env.JWT_SECRET_MESSAGE);
    return c.json({
        JWT: token
    })
})