
import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepositorie } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'


let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepositorie
let sut: CheckInUseCase


describe('Check-in Use Case', () => {

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepositorie()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -29.1855699,
      longitude: -51.1709673
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be alble to check in', async () => {

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be alble to check in twice in the same day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })

    await expect(sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be alble to check in twice in different day', async () => {

    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be alble to check in on a distant gym', async () => {


    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript2 Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-29.0855699),
      longitude: new Decimal(-51.3709673)
    })

    await expect(() => sut.execute({
      gymId: 'gym-02',
      userId: 'user-01',
      userLatitude: -29.1855699,
      userLongitude: -51.1709673
    })).rejects.toBeInstanceOf(MaxDistanceError)

  })

})

