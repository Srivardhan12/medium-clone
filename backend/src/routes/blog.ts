import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt';
import { updateBlogInput } from "@srivardhan_24/medium-project";
import { createBlogInput } from "@srivardhan_24/medium-project";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET_MESSAGE: string
    },
    Variables: {
        userId: string;
    }
}>()

blogRouter.use('/', async (c, next) => {
    try {
        const header = c.req.header("Authorization") || "";
        const user = await verify(header, c.env.JWT_SECRET_MESSAGE)
        if (!user) {
            c.status(403)
            return c.json({
                message: "You are not logged in"
            })
        }
        c.set('userId', String(user.id));
        await next();
    } catch (error) {
        return c.json({ error })
    }
})

blogRouter.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const authorId = c.get('userId')
        const { success } = createBlogInput.safeParse(body);
        if (!success) {
            c.status(411);
            return c.json({ error: "Inputs are incorrect" })
        }
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        const blog = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                date: body.date,
                authorId: Number(authorId)
            }
        })
        if (!blog) {
            c.status(411);
            return c.json({
                error: "error occured"
            })
        }
        return c.json({
            id: blog.id
        })
    } catch (error) {
        return c.json({ error })
    }
})

blogRouter.put('/:id', async (c) => {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ error: "Inputs are incorrect" })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog: any = await prisma.post.update({
        where: {
            id: Number(id)
        },
        data: {
            title: body.title,
            content: body.content
        }
    })
    if (!blog) {
        c.status(411);
        return c.json({
            error: "error occured while updating"
        })
    }
    return c.json({
        id: blog.id
    })
})

blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());
        const blogs = await prisma.post.findMany({
            select: {
                title: true,
                content: true,
                date: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json({ blogs })
    } catch (error) {
        return c.json({ error });
    }
});

blogRouter.get('/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                title: true,
                content: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        return c.json({
            blog
        });

    } catch (error) {
        return c.json({ error })
    }
})


