import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";


interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse {
  checkInCount: Number
}

export class GetUserMetricsUseCase {

  constructor(
    private checkInsRepository: CheckInsRepository,
  ) { }

  async execute({ userId }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {

    const checkInCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInCount
    }
  }

}