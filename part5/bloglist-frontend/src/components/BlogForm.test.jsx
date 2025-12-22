import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import BlogForm from './BlogForm';

test('calls createBlog with correct details when form is submitted', () => {
  const mockCreateBlog = vi.fn();

  render(<BlogForm createBlog={mockCreateBlog} />);

  const titleInput = screen.getByLabelText('title:');
  const authorInput = screen.getByLabelText('author:');
  const urlInput = screen.getByLabelText('url:');
  const form = screen.getByTestId('blog-form');

  fireEvent.change(titleInput, { target: { value: 'Test Title' } });
  fireEvent.change(authorInput, { target: { value: 'Test Author' } });
  fireEvent.change(urlInput, { target: { value: 'http://test.com' } });
  fireEvent.submit(form);

  expect(mockCreateBlog).toHaveBeenCalledTimes(1);
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://test.com',
  });
});
