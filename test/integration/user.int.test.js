import request from 'supertest';
import faker from 'faker';
import app from '../../app.js';

const routeUrl = '/users';
const signUpUrl = '/users/signup';
const signInUrl = '/users/signin';

describe(routeUrl, () => {
  const newUser = {
    email: 'adex@gmail.com',
    password: 'john4real'
  };
  console.log(newUser);
  let createdUser;
  let firstUser;
  it(`get ${routeUrl}`, async () => {
    const response = await request(app).get(routeUrl);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    firstUser = response.body[0];
  });
  it(`post ${signUpUrl}`, async () => {
    const response = await request(app).post(signUpUrl).send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBe(newUser.password);
    createdUser = response.body;
  });
  it(`post ${signInUrl}`, async () => {
    const response = await request(app).post(signInUrl).send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBe(newUser.password);
  });
});
