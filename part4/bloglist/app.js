const express = require('express');
const app = express();
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const {
  tokenExtractor,
  userExtractor,
  errorHandler,
} = require('./utils/middleware');

app.use(express.json());
app.use(tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

module.exports = app;
