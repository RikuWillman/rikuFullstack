import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      );
    },
    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog._id !== id);
    },
    addCommentToBlog(state, action) {
      const { blogId, comment } = action.payload;
      const blog = state.find((b) => b._id === blogId);
      if (blog) {
        blog.comments = blog.comments ? [...blog.comments, comment] : [comment];
      }
    },
  },
});

export const {
  setBlogs,
  appendBlog,
  updateBlog,
  removeBlog,
  addCommentToBlog,
} = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blogObject);
    dispatch(appendBlog(newBlog));
    return newBlog;
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    try {
      const blogToUpdate = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user._id || blog.user,
      };

      const updatedBlog = await blogService.update(blog._id, blogToUpdate);
      dispatch(updateBlog(updatedBlog));
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlog(id));
  };
};

export const addComment = (blogId, comment) => {
  return async (dispatch) => {
    const response = await fetch(`/api/blogs/${blogId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    });

    if (response.ok) {
      const updatedBlog = await response.json();
      dispatch(updateBlog(updatedBlog));
    }
  };
};

export default blogSlice.reducer;
