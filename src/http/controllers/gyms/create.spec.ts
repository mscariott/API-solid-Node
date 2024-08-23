import { it, describe, expect, beforeAll, afterAll } from "vitest";
import request from 'supertest'
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";


describe('Create Gym (e2e)', () => {

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {

    const { token } = await createAndAuthenticateUser(app, true)
   
    const response = await request(app.server).post('/gyms').set('Authorization', `Bearer ${token}`).send({
      title: 'JS Gym',
      description: 'Some description',
      phone: '999999999',
      latitude: -29.1855699,
      longitude: -51.1709673,
    })

    expect(response.statusCode).toEqual(201)
  })
})