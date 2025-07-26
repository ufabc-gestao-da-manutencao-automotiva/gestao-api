import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import prisma from "../_prisma";

const app = Fastify({
  logger: true,
});

// GET /api/vehicles
app.get("/api/vehicles", async (req, reply) => {
  const vehicles = await prisma.vehicle.findMany();
  return reply.status(200).send(vehicles);
});

// POST /api/vehicles
app.post("/api/vehicles", async (req, reply) => {
  const { client_id, plate, model, brand, year, chassis, color } = req.body as any;

  // Validações
  if (!client_id) {
    return reply.status(400).send({ message: "É obrigatório informar o id do cliente ou empresa" });
  }

  if (!plate) {
    return reply.status(400).send({ message: "É obrigatório informar a placa do veículo" });
  }

  if (!model) {
    return reply.status(400).send({ message: "É obrigatório informar o modelo do veículo" });
  }

  if (!brand) {
    return reply.status(400).send({ message: "É obrigatório informar a marca do veículo" });
  }

  if (!year) {
    return reply.status(400).send({ message: "É obrigatório informar o ano do veículo" });
  }

  if (!chassis) {
    console.warn("Aviso: veículo cadastrado sem número de chassi");
  }

  if (!color) {
    return reply.status(400).send({ message: "É obrigatório informar a cor do veículo" });
  }

  // Criação no banco
  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        client_id,
        plate,
        model,
        brand,
        year,
        chassis,
        color,
      },
    });

    return reply.status(200).send(vehicle);
  } catch (error) {
    return reply.status(400).send({ message: JSON.stringify(error) });
  }
});

// Handler para integração com vercel ou adaptadores
export default async function handler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  await app.ready();
  app.server.emit("request", req, reply);
}
