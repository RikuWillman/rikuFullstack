import { Alert } from 'react-bootstrap';

const Notification = ({ notification }) => {
  if (notification === null) {
    return null;
  }

  return (
    <Alert
      variant={notification.type === 'error' ? 'danger' : 'success'}
      className="mt-3"
      dismissible
    >
      {notification.message}
    </Alert>
  );
};

export default Notification;
