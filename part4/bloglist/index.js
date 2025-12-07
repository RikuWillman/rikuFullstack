const app = require('./app');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

require('dotenv').config();
const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl, { family: 4 });

const blogsRouter = require('./controllers/blogs');
app.use('/api/blogs', blogsRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
