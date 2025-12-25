import { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { addComment } from '../reducers/blogReducer';
import { Form, Button, InputGroup } from 'react-bootstrap';

const Comments = ({ blogId }) => {
  const [comment, setComment] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      dispatch(addComment(blogId, comment));
      setComment('');
    }
  };

  return (
    <div className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Add a comment:</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button variant="primary" type="submit">
              Add Comment
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );
};

export default Comments;
