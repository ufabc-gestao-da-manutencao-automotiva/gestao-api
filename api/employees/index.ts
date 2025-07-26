import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

// GET /api/employees
app.get("/api/employees", async (req, reply) => {
  const employees = await prisma.employee.findMany();
  return reply.status(200).send(employees);
});

// POST /api/employees
app.post("/api/employees", async (req, reply) => {
  const { name, area } = req.body as any;

  if (!name) {
    return reply.status(400).send({
      message: "É obrigatório informar o nome do funcionário",
    });
  }

  if (!area) {
    return reply.status(400).send({
      message: "É obrigatório informar a área de atuação do funcionário",
    });
  }

  try {
    const employee = await prisma.employee.create({
      data: {
        name,
        area,
      },
    });

    return reply.status(201).send(employee);
  } catch (error) {
    return reply.status(400).send({
      message: "Erro ao cadastrar funcionário",
      error: JSON.stringify(error),
    });
  }
});

// Para integração com frameworks tipo Vercel (caso use handler):
export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}
