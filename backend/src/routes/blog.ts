import { Context, Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET_MESSAGE: string
    },
    Variables: {
        userId: string;
    }
}>()

blogRouter.use('/*', async (c, next) => {
    const header = c.req.header("autherization") || "";
    const user = await verify(header, c.env.JWT_SECRET_MESSAGE)
    if (!user) {
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
    c.set('userId', String(user.id));
    next();
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const authorId = c.get('userId')
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: ""
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
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.update({
        where: {
            id: body.id
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

blogRouter.get('/', async (c) => {
    const body = await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blog = await prisma.post.findFirst({
        where: {
            id: body.id
        }
    })
    if (!blog) {
        c.status(411);
        return c.json({
            error: "error occured while updating"
        })
    }
    return c.json({
        blog
    })
})

blogRouter.post('/bulk', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const blogs = await prisma.post.findMany();

    if (!blogs) {
        c.status(411);
        return c.json({
            error: "error occured while updating"
        })
    }
    return c.json({
        blogs
    })
})
