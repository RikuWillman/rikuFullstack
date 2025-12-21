const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index');
const Blog = require('../models/blog');
const api = supertest(app);

let token = '';

beforeEach(async () => {
  await Blog.deleteMany({});

  await api.post('/api/users').send({
    username: 'testuser',
    name: 'Test User',
    password: 'password',
  });

  const loginResponse = await api.post('/api/login').send({
    username: 'testuser',
    password: 'password',
  });

  token = loginResponse.body.token;
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, 1);
  assert.strictEqual(response.body[0].title, 'Test Blog');
});

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Blog to delete',
    author: 'Test Author',
    url: 'http://delete.com',
    likes: 3,
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog);

  const blogId = postResponse.body._id;

  await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, 0);
});

test('a blog can be updated', async () => {
  const newBlog = {
    title: 'Original Blog',
    author: 'Test Author',
    url: 'http://original.com',
    likes: 2,
  };

  const postResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog);

  const blogId = postResponse.body._id;

  const updatedBlog = {
    title: 'Updated Blog',
    author: 'Test Author',
    url: 'http://updated.com',
    likes: 10,
  };

  const updateResponse = await api
    .put(`/api/blogs/${blogId}`)
    .send(updatedBlog)
    .expect(200);

  assert.strictEqual(updateResponse.body.title, 'Updated Blog');
  assert.strictEqual(updateResponse.body.likes, 10);

  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body[0].title, 'Updated Blog');
});

test('blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Test Author',
    url: 'http://nourl.com',
  };

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('blog without title returns 400', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://notitle.com',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

test('blog without url returns 400', async () => {
  const newBlog = {
    title: 'No URL blog',
    author: 'Test Author',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
