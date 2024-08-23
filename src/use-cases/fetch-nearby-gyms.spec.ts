
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepositorie } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'



let gymsRepository: InMemoryGymsRepositorie
let sut: FetchNearbyGymsUseCase


describe('Featch Nearby Gyms Use Case', () => {

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositorie()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })


  it('should be alble fetch nearby gyms', async () => {

    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -29.1855699,
      longitude: -51.1709673,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -29.3855699,
      longitude: -51.4709673,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' })
    ])
  })

})

