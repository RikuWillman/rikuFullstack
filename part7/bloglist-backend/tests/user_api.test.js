const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index');
const User = require('../models/user');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

test('user with valid data can be created', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Valid User',
    password: 'password123',
  };

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/users');
  assert.strictEqual(response.body.length, 1);
  assert.strictEqual(response.body[0].username, 'validuser');
});

test('user without username returns 400', async () => {
  const newUser = {
    name: 'No Username',
    password: 'password123',
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('user with username less than 3 chars returns 400', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'password123',
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('user without password returns 400', async () => {
  const newUser = {
    username: 'nopassword',
    name: 'No Password',
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('user with password less than 3 chars returns 400', async () => {
  const newUser = {
    username: 'shortpass',
    name: 'Short Password',
    password: 'ab',
  };

  await api.post('/api/users').send(newUser).expect(400);
});

test('duplicate username returns 400', async () => {
  const newUser = {
    username: 'duplicate',
    name: 'Duplicate User',
    password: 'password123',
  };

  await api.post('/api/users').send(newUser).expect(201);

  await api.post('/api/users').send(newUser).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
