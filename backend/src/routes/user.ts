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
        const { success, error: validationError } = signupInput.safeParse(body);
        if (!success) {
            c.status(401);
            return c.json({
                error: "Inputs are not correct",
                details: validationError
            });
        }
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.username,
                password: body.password,
            }
        });
        if (!user) {
            c.status(403);
            return c.json({
                error: "Error while signup"
            });
        }
        const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET_MESSAGE);
        return c.text(token);
    } catch (error) {
        c.status(401);
        return c.json({ error: "Please check your Credentials!" });
    }
});


userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body)
    if (!success) {
        c.status(401);
        return c.json({ error: "Inputs are incorrect" });
    }
    const user = await prisma.user.findFirst({
        where: {
            email: body.username,
            password: body.password
        }
    })

    if (!user) {
        c.status(401);
        return c.json({ error: "Please check your Credentials!" })
    }
    const token = await sign({ id: user.id, name: user.name }, c.env.JWT_SECRET_MESSAGE);
    return c.json({ token: token })
})