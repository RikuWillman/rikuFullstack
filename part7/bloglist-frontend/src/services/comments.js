import axios from 'axios';

const addComment = async (blogId, comment) => {
  const response = await axios.post(`/api/blogs/${blogId}/comments`, {
    comment,
  });
  return response.data;
};

export default { addComment };
