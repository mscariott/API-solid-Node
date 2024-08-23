
import { expect, describe, it, beforeEach } from 'vitest'


import { InMemoryGymsRepositorie } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepositorie
let sut: CreateGymUseCase


describe('Register Use Case', () => {

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepositorie()
    sut = new CreateGymUseCase(gymsRepository)
  })


  it('should be alble to register', async () => {

    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      latitude: -29.1855699,
      longitude: -51.1709673,
      description: null,
      phone: null
    })

    expect(gym.id).toEqual(expect.any(String))
  })

})

