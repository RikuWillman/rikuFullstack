import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: notification.type === 'error' ? '#ffebee' : '#e8f5e9',
    color: notification.type === 'error' ? '#c62828' : '#2e7d32',
    borderColor: notification.type === 'error' ? '#c62828' : '#2e7d32',
  }

  if (!notification.message) return null

  return <div style={style}>{notification.message}</div>
}

export default Notification
