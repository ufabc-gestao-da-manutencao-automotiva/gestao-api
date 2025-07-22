import Fastify, { FastifyRequest, FastifyReply } from "fastify";

const app = Fastify({
  logger: true,
});

app.get("/", async (req, reply) => {
  return reply.status(200).send({ message: "Ola mundo" });
});

export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}