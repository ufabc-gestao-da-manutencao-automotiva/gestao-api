import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

app.get("/api/user", async (req, reply) => {
  const users = await prisma.user.findMany();
  return reply.status(200).send(users);
});

app.post("/api/user", async (req, reply) => {
  const { name, age } = req.body as any;

  if (!age){
      return reply.status(400).send({ message: "É obrigatório informar idade" });
}

  try {
    const user = await prisma.user.create({
      data: {
        name,
        age,
      },
    });

    return reply.status(200).send(user);
  } catch (error) {
    return reply.status(400).send({ message: JSON.stringify(error) });
  }
});



//já fiz o get/Read e o post/Create
//agora falta o put/Update e o delete/Delete

//dpois fazer o get, post, put e delete das outras collections

//


export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}