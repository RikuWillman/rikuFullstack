import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Blog from './Blog';

test('renders title and author but not URL or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { name: 'Test User' },
  };

  render(<Blog blog={blog} />);

  expect(screen.getByText('Test Blog Test Author')).toBeInTheDocument();
  expect(screen.queryByText('http://test.com')).not.toBeInTheDocument();
  expect(screen.queryByText('likes 5')).not.toBeInTheDocument();
});

test('renders URL and likes when view button is clicked', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { name: 'Test User' },
  };

  render(<Blog blog={blog} />);

  const viewButton = screen.getByText('view');
  fireEvent.click(viewButton);

  expect(screen.getByText('http://test.com')).toBeInTheDocument();
  expect(screen.getByText('likes 5')).toBeInTheDocument();
});

test('like button handler is called twice when clicked twice', () => {
  const blog = {
    _id: 'test-id',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: { id: 'user-id', name: 'Test User' },
  };

  const mockUpdateBlog = vi.fn();

  render(<Blog blog={blog} updateBlog={mockUpdateBlog} />);

  const viewButton = screen.getByText('view');
  fireEvent.click(viewButton);

  const likeButton = screen.getByText('like');
  fireEvent.click(likeButton);
  fireEvent.click(likeButton);

  expect(mockUpdateBlog).toHaveBeenCalledTimes(2);

  // First call: likes = 5 + 1 = 6
  expect(mockUpdateBlog.mock.calls[0][0]).toBe(blog._id);
  expect(mockUpdateBlog.mock.calls[0][1].likes).toBe(6);

  // Second call: likes = 5 + 1 = 6 (blog object doesn't mutate)
  expect(mockUpdateBlog.mock.calls[1][0]).toBe(blog._id);
  expect(mockUpdateBlog.mock.calls[1][1].likes).toBe(6);
});
