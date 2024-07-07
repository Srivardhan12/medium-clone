import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';
import { signupInput } from "@srivardhan_24/medium-project";
import { signinInput } from "@srivardhan_24/medium-project";
import { parseSigned } from "hono/utils/cookie";

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
        const { success } = signupInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json(
                {
                    error: "Inputs are not correct"
                })
        }
        const user = await prisma.user.create({
            data: {
                email: body.username,
                password: body.password,
                name: body.name
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
    const { success } = signinInput.safeParse(body)
    if (!success) {
        c.status(411);
        return c.json({ error: "Inputs are incorrect" });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: body.username,
            password: body.password
        }
    })

    if (!user) {
        c.status(403);
        return c.json({
            error: "user with this email does not exist"
        })
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET_MESSAGE);
    return c.json({
        JWT: token
    })
})