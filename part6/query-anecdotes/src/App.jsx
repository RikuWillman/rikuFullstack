import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const dispatchNotification = useNotificationDispatch()

  const {
    data: anecdotes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, anecdote }) => updateAnecdote(id, anecdote),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      const anecdoteContent = variables.anecdote.content
      dispatchNotification({
        type: 'SET',
        payload: {
          message: `You voted for: "${anecdoteContent}"`,
          type: 'success',
        },
      })
      setTimeout(() => {
        dispatchNotification({ type: 'CLEAR' })
      }, 5000)
    },
  })

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    }
    voteMutation.mutate({ id: anecdote.id, anecdote: updatedAnecdote })
  }

  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (isError) {
    return (
      <div>
        Anecdote service not available due to problems in server on localhost:{' '}
        {error.message}
      </div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
