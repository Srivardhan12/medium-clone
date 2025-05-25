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
        const today: Date = new Date();
        const dd: string = String(today.getDate()).padStart(2, '0');
        const mm: string = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy: number = today.getFullYear();

        const formattedDate: string = `${dd}-${mm}-${yyyy}`;

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
                date: formattedDate,
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

blogRouter.put('update/:id', async (c) => {
    try {
        const id = c.req.param("id");
        const userId = c.get('userId');
        const body = await c.req.json();

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        // Check if the blog exists and belongs to the user
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id),
            }
        });

        if (!blog) {
            c.status(403);
            return c.json({
                error: "Blog not found or you don't have permission to update it",
            });
        }

        // Update the blog
        const updatedBlog = await prisma.post.update({
            where: {
                id: Number(id)
            },
            data: {
                title: body.title,
                content: body.content
            }
        });

        return c.json({
            id: updatedBlog.id,
        });
    } catch (error) {
        return c.json({ error });
    }
});

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

blogRouter.get('/author/:authorId', async (c) => {
    try {
        const authorId = c.req.param("authorId");
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())
        const blogs = await prisma.post.findMany({
            where: {
                authorId: Number(authorId)
            },
            select: {
                title: true,
                content: true,
                date: true,
                id: true,
                author: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        })
        return c.json({
            blogs
        });
    } catch (error) {
        return c.json({ error })
    }
})

blogRouter.delete('delete/:id', async (c) => {
    try {
        const id = c.req.param("id");

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate())

        // First check if the blog exists and belongs to the user
        const blog = await prisma.post.findFirst({
            where: {
                id: Number(id),
            }
        });

        if (!blog) {
            c.status(403);
            return c.json({
                error: "Blog not found or you don't have permission to delete it"
            });
        }

        // Delete the blog
        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        });

        return c.json({
            message: "Blog deleted successfully"
        });
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
                        name: true,
                        id: true
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
