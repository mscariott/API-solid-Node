
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepositorie } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'



let gymsRepository: InMemoryGymsRepositorie
let sut: SearchGymsUseCase


describe('Search Gyms Use Case', () => {

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepositorie()
    sut = new SearchGymsUseCase(gymsRepository)
  })


  it('should be alble to search for gyms', async () => {

    await gymsRepository.create({
      title: 'JavaScript Gym',
      latitude: -29.1855699,
      longitude: -51.1709673,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'TypeScript Gym',
      latitude: -29.1855699,
      longitude: -51.1709673,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym' })
    ])
  })


  it('should be alble to fetch paginated gym search', async () => {

    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `JavaScript Gym ${i}`,
        latitude: -29.1855699,
        longitude: -51.1709673,
        description: null,
        phone: null
      })
    }
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: `JavaScript Gym 21` }),
      expect.objectContaining({ title: `JavaScript Gym 22` })
    ])
  })
})

