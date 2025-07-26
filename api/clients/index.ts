import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

app.get("/api/clients", async (req, reply) => {
  const clients = await prisma.client.findMany();
  return reply.status(200).send(clients);
});

app.delete("/api/clients", async (req, reply) => {
  const clients = await prisma.client.deleteMany();
  return reply.status(200).send(clients);
});

app.delete("/api/clients/:clientId", async (req, reply) => {
  const { clientId } = req.params as any;

  const client = await prisma.client.delete({
    where:{
      id:clientId
    }
  });

  return reply.status(200).send(client);
  
});


app.post("/api/clients", async (req, reply) => {
  const { name, phone } = req.body as any;

  if (!name){
    return reply.status(400).send({ message: "É obrigatório informar nome do cliente ou empresa" });
  }

  if (!phone){
      return reply.status(400).send({ message: "É obrigatório informar o telefone" });
}

  try {
    const client = await prisma.client.create({
      data: {
        name,
        phone,
      },
    });

    return reply.status(200).send(client);
  } catch (error) {
    return reply.status(400).send({ message: JSON.stringify(error) });
  }
});


export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}