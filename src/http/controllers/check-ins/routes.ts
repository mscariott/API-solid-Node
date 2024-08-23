import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { FastifyInstance } from "fastify";
import { create } from "./create";
import { valdiate } from "./validate";
import { history } from "./history";
import { metrics } from "./metrics";
import { verifyUserRole } from "@/http/middlewares/verify-user-role";


export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch('/check-in/:checkInId/validate',{ onRequest: [verifyUserRole('ADMIN')] } ,valdiate)
  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
}