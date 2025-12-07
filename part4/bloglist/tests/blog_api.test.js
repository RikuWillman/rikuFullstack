const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const { app } = require('../index');
const Blog = require('../models/blog');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
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

  const postResponse = await api.post('/api/blogs').send(newBlog);

  const blogId = postResponse.body._id;

  await api.delete(`/api/blogs/${blogId}`).expect(204);

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

  const postResponse = await api.post('/api/blogs').send(newBlog);

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

after(async () => {
  await mongoose.connection.close();
});
