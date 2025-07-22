import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma"

const app = Fastify({
    logger: true,
});

app.get("/api/user", async (req, reply) => {
    const users = prisma.user.findMany();
    return reply.status(200).send(users);
});

app.get("/api/users", async (req, reply) => {
    const users = prisma.user.findMany();
    return reply.status(200).send(users);
});

app.post("/api/user", async (req, reply) => {
    const { name, age } = req.body as any;
    const user = prisma.user.create({
        data: {
            name, age
        }
    });
    return reply.status(200).send(user);
});

export default async function handler(
    req: FastifyRequest,
    reply: FastifyReply
) {
    await app.ready();
    app.server.emit("request", req, reply);
}