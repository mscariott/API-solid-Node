import { UserAlredyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { makeRegisterUserCase } from "@/use-cases/factories/make-register-use-case"
import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const { email, name, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUserCase()

    await registerUseCase.execute({
      name,
      email,
      password
    })
  } catch (err) {
    if (err instanceof UserAlredyExistsError) {
      return reply.status(409).send({ message : err.message})
    }

    throw err
  }


  return reply.status(201).send()

}