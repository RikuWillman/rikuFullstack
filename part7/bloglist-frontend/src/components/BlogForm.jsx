import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          placeholder="Enter blog title"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          placeholder="Enter author name"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>URL</Form.Label>
        <Form.Control
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          placeholder="Enter blog URL"
        />
      </Form.Group>

      <Button variant="success" type="submit">
        Create
      </Button>
    </Form>
  );
};

export default BlogForm;
