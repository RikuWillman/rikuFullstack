import { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import {
  initializeBlogs,
  createBlog,
  likeBlog,
  deleteBlog,
} from './reducers/blogReducer';
import { setUser, clearUser, initializeUsers } from './reducers/userReducer';
import { showNotification } from './reducers/notificationReducer';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Togglable from './components/Togglable';
import Users from './components/Users';
import User from './components/User';
import BlogView from './components/BlogView';

import {
  Container,
  Navbar,
  Nav,
  Card,
  ListGroup,
  Button,
  Form,
  Alert,
  Table,
  Badge,
} from 'react-bootstrap';

const App = () => {
  const dispatch = useAppDispatch();
  const blogs = useAppSelector((state) => state.blogs);
  const user = useAppSelector((state) => state.user.currentUser);
  const notification = useAppSelector((state) => state.notification);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
    }
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      dispatch(initializeBlogs());
      dispatch(initializeUsers());
      setUsername('');
      setPassword('');
      dispatch(showNotification('Login successful', 'success'));
    } catch (_exception) {
      dispatch(showNotification('Wrong credentials', 'error'));
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    dispatch(clearUser());
    blogService.setToken(null);
  };

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await dispatch(createBlog(blogObject));
      blogFormRef.current.toggleVisibility();
      dispatch(
        showNotification(
          `A new blog "${newBlog.title}" by ${newBlog.author} added`,
          'success'
        )
      );
    } catch (_exception) {
      dispatch(showNotification('Failed to add blog', 'error'));
    }
  };

  const handleLike = (blog) => {
    dispatch(likeBlog(blog));
  };

  const removeBlog = async (id) => {
    if (window.confirm('Remove blog?')) {
      try {
        await dispatch(deleteBlog(id));
        dispatch(showNotification('Blog removed', 'success'));
      } catch (_exception) {
        dispatch(showNotification('Failed to remove blog', 'error'));
      }
    }
  };

  if (user === null) {
    return (
      <Container className="mt-5" style={{ maxWidth: '400px' }}>
        <Card>
          <Card.Body>
            <Card.Title className="text-center mb-4">
              Log in to application
            </Card.Title>
            <Notification notification={notification} />
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                  placeholder="Enter password"
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Router>
      <Container className="mt-4">
        {/* Navigation Bar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded">
          <Container>
            <Navbar.Brand as={Link} to="/">
              Bloglist
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">
                  Blogs
                </Nav.Link>
                <Nav.Link as={Link} to="/users">
                  Users
                </Nav.Link>
              </Nav>
              <Nav>
                <Navbar.Text className="text-light me-3">
                  {user.name} logged in
                </Navbar.Text>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Notification */}
        <Notification notification={notification} />

        {/* Main Content */}
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Card className="mb-4">
                  <Card.Body>
                    <Card.Title>Create New Blog</Card.Title>
                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                      <BlogForm createBlog={addBlog} />
                    </Togglable>
                  </Card.Body>
                </Card>

                <Card>
                  <Card.Body>
                    <Card.Title>Blogs</Card.Title>
                    {sortedBlogs.length === 0 ? (
                      <Alert variant="info">
                        No blogs yet. Create the first one!
                      </Alert>
                    ) : (
                      <ListGroup>
                        {sortedBlogs.map((blog) => (
                          <ListGroup.Item
                            key={blog._id}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <div className="flex-grow-1 me-3">
                              <Link
                                to={`/blogs/${blog._id}`}
                                className="text-decoration-none"
                              >
                                <strong>{blog.title}</strong> by {blog.author}
                              </Link>
                            </div>
                            <div className="d-flex align-items-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleLike(blog)}
                              >
                                Like ({blog.likes})
                              </Button>
                              <Badge bg="secondary" className="me-2">
                                {blog.comments?.length || 0} comments
                              </Badge>
                              {blog.user &&
                                (blog.user.id === user.id ||
                                  blog.user === user.id) && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeBlog(blog._id)}
                                  >
                                    Delete
                                  </Button>
                                )}
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/:id" element={<BlogView />} />
        </Routes>

        {/* Footer */}
        <footer className="mt-5 pt-3 text-muted border-top text-center">
          <p>Bloglist App - Full Stack Open 2025</p>
        </footer>
      </Container>
    </Router>
  );
};

export default App;
