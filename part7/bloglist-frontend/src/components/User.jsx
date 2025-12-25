import { useParams } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { Card, ListGroup, Alert, Badge } from 'react-bootstrap';

const User = () => {
  const { id } = useParams();
  const users = useAppSelector((state) => state.user.allUsers);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="warning">User not found</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">
          {user.name}
          <Badge bg="secondary" className="ms-2">
            {user.blogs.length} blogs
          </Badge>
        </Card.Title>

        {user.blogs.length === 0 ? (
          <Alert variant="info">No blogs added yet</Alert>
        ) : (
          <>
            <Card.Subtitle className="mb-2 text-muted">
              Added blogs:
            </Card.Subtitle>
            <ListGroup>
              {user.blogs.map((blog) => (
                <ListGroup.Item
                  key={blog.id}
                  action
                  href={blog.url}
                  target="_blank"
                >
                  <strong>{blog.title}</strong>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default User;
