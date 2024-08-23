import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-vallidate-check-in-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function valdiate(request: FastifyRequest, reply: FastifyReply) {

  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)


  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
   checkInId
  })

  return reply.status(204).send()

}