import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

// GET /api/approaches
app.get("/api/approaches", async (req, reply) => {
  const approaches = await prisma.approach.findMany();
  return reply.status(200).send(approaches);
});

// POST /api/approaches
app.post("/api/approaches", async (req, reply) => {
  const {
    client_id,
    vehicle_id,
    employee_id,
    date,
    time,
    approach_type,
    visit_reason,
    origin,
  } = req.body as any;

  // Validações
  if (!client_id) {
    return reply.status(400).send({
      message: "É obrigatório informar o id do cliente",
    });
  }

  if (!vehicle_id) {
    return reply.status(400).send({
      message: "É obrigatório informar o id do veículo",
    });
  }

  if (!employee_id) {
    return reply.status(400).send({
      message: "É obrigatório informar o id do funcionário que fez o atendimento",
    });
  }

  if (!date) {
    return reply.status(400).send({
      message: "É obrigatório informar a data de atendimento ao cliente",
    });
  }

  if (!time) {
    return reply.status(400).send({
      message: "É obrigatório informar o horário de atendimento ao cliente",
    });
  }

  if (!approach_type) {
    return reply.status(400).send({
      message: "É obrigatório informar o tipo de abordagem",
    });
  }

  try {
    const approach = await prisma.approach.create({
      data: {
        client_id,
        vehicle_id,
        employee_id,
        date,
        time,
        approach_type,
        visit_reason,
        origin,
      },
    });

    return reply.status(201).send(approach);
  } catch (error) {
    return reply.status(400).send({
      message: "Erro ao cadastrar abordagem",
      error: JSON.stringify(error),
    });
  }
});

// Para integração com Vercel (caso esteja usando handler)
export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}
