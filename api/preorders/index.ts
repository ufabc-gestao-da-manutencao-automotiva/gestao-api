import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

// GET /api/preorders
app.get("/api/preorders", async (req, reply) => {
  const preorders = await prisma.preOrder.findMany();
  return reply.status(200).send(preorders);
});

// POST /api/preorders
app.post("/api/preorders", async (req, reply) => {
  const {
    id_cliente,
    id_veiculo,
    id_abordagem,
    data,
    hora,
    nivel_combustivel,
    servicos_solicitados,
    observacoes,
    fotos_danos,
    assinatura_cliente,
    assinatura_consultor,
    finalizado,
  } = req.body as any;

  // Validações básicas
  if (!id_cliente) {
    return reply.status(400).send({
      message: "É obrigatório informar o ID do cliente",
    });
  }

  if (!id_veiculo) {
    return reply.status(400).send({
      message: "É obrigatório informar o ID do veículo",
    });
  }

  if (!id_abordagem) {
    return reply.status(400).send({
      message: "É obrigatório informar o ID da abordagem vinculada",
    });
  }

  if (!data) {
    return reply.status(400).send({
      message: "É obrigatório informar a data da pré-ordem",
    });
  }

  if (!hora) {
    return reply.status(400).send({
      message: "É obrigatório informar o horário da pré-ordem",
    });
  }

  if (!nivel_combustivel) {
    return reply.status(400).send({
      message: "É obrigatório informar o nível de combustível",
    });
  }

  if (
    !servicos_solicitados ||
    !Array.isArray(servicos_solicitados) ||
    servicos_solicitados.length === 0
  ) {
    return reply.status(400).send({
      message: "É obrigatório informar ao menos um serviço solicitado",
    });
  }

  if (typeof assinatura_cliente !== "boolean") {
    return reply.status(400).send({
      message: "É obrigatório informar se o cliente assinou ou não",
    });
  }

  if (typeof assinatura_consultor !== "boolean") {
    return reply.status(400).send({
      message: "É obrigatório informar se o consultor assinou ou não",
    });
  }

  if (typeof finalizado !== "boolean") {
    return reply.status(400).send({
      message: "É obrigatório informar se a pré-ordem foi finalizada ou não",
    });
  }

  try {
    const preOrder = await prisma.preOrder.create({
      data: {
        id_cliente,
        id_veiculo,
        id_abordagem,
        data,
        hora,
        nivel_combustivel,
        servicos_solicitados,
        observacoes: observacoes || null,
        fotos_danos: fotos_danos || [],
        assinatura_cliente,
        assinatura_consultor,
        finalizado,
      },
    });

    return reply.status(201).send(preOrder);
  } catch (error) {
    return reply.status(400).send({
      message: "Erro ao cadastrar pré-ordem",
      error: JSON.stringify(error),
    });
  }
});

// Para integração com Vercel (caso use handler):
export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}
