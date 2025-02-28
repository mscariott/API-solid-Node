import { it, describe, expect, beforeAll, afterAll } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";


describe('Search Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms by title', async () => {

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
      latitude: -29.1855699,
      longitude: -51.1709673,
    })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'JS'
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