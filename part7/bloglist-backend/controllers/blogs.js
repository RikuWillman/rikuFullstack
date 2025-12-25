const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body;
  const user = request.user;

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  await savedBlog.populate('user', { username: 1, name: 1 });
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response
      .status(401)
      .json({ error: 'only the creator can delete a blog' });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = {
    title,
    author,
    url,
    likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user', { username: 1, name: 1 });

  response.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body;
  const blog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' });
  }

  blog.comments = blog.comments.concat(comment);
  const savedBlog = await blog.save();
  response.json(savedBlog);
});

module.exports = blogsRouter;
