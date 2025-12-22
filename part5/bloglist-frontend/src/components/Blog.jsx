import { useState } from 'react';

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user,
    };
    updateBlog(blog._id, updatedBlog);
  };

  const handleRemove = () => {
    removeBlog(blog._id);
  };

  const showRemoveButton =
    blog.user && user && (blog.user.id === user.id || blog.user === user.id);

  const getUserName = () => {
    if (!blog.user) return 'Unknown user';
    if (blog.user.name) return blog.user.name;
    if (blog.user.username) return blog.user.username;
    return 'Unknown user';
  };

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility} className="view-button">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div data-testid="url">{blog.url}</div>
          <div data-testid="likes">
            likes {blog.likes}{' '}
            <button onClick={handleLike} className="like-button">
              like
            </button>
          </div>
          <div>{getUserName()}</div>
          {showRemoveButton && <button onClick={handleRemove}>remove</button>}
        </div>
      )}
    </div>
  );
};

export default Blog;
