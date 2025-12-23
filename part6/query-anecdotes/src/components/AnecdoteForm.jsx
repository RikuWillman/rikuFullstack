import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (error) => {
      dispatchNotification({
        type: 'SET',
        payload: {
          message: error.message,
          type: 'error',
        },
      })
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR' })
      }, 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content, {
      onSuccess: () => {
        dispatchNotification({
          type: 'SET',
          payload: {
            message: `New anecdote created: "${content}"`,
            type: 'success',
          },
        })
        setTimeout(() => {
          dispatchNotification({ type: 'CLEAR' })
        }, 5000)
      },
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
