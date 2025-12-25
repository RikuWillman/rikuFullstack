import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { initializeUsers } from '../reducers/userReducer';
import { Link } from 'react-router-dom';
import { Table, Card, Alert, Badge } from 'react-bootstrap';

const Users = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.user.allUsers);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  if (!users || users.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="info">Loading users...</Alert>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-4">Users</Card.Title>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Blogs Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Link
                    to={`/users/${user.id}`}
                    className="text-decoration-none"
                  >
                    {user.name}
                  </Link>
                </td>
                <td>
                  <Badge bg="primary">{user.blogs.length}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default Users;
