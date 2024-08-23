import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })



  it('should be alble to list nearby gyms', async () => {

    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'JS Gym',
      description: 'Some description',
      phone: '999999999',
      latitude: -29.1855699,
      longitude: -51.1709673,
    })

    await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'TS Gym',
      description: 'Some description',
      phone: '999999999',
      latitude: -29.3855699,
      longitude: -51.4709673,
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -29.1855699,
        longitude: -51.1709673
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JS Gym',
      })
    ])
  })

})

