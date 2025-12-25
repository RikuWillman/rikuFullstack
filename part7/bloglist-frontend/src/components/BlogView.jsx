import { useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';
import Comments from './Comments';

const BlogView = () => {
  const { id } = useParams();
  const blogs = useAppSelector((state) => state.blogs);
  const blog = blogs.find((b) => b._id === id);

  if (!blog) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>Blog not found</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">
          {blog.title}
          <Badge bg="secondary" className="ms-2">
            {blog.likes} likes
          </Badge>
        </Card.Title>

        <Card.Subtitle className="mb-3 text-muted">
          by {blog.author}
        </Card.Subtitle>

        <Card.Text>
          <strong>URL:</strong>{' '}
          <a href={blog.url} target="_blank" rel="noreferrer">
            {blog.url}
          </a>
        </Card.Text>

        <Card.Text>
          <strong>Added by:</strong> {blog.user?.name || 'Unknown user'}
        </Card.Text>

        {/* Existing comments */}
        {blog.comments && blog.comments.length > 0 && (
          <div className="mt-4">
            <Card.Subtitle>Comments:</Card.Subtitle>
            <ListGroup className="mt-2">
              {blog.comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        <Comments blogId={id} />
      </Card.Body>
    </Card>
  );
};

export default BlogView;
