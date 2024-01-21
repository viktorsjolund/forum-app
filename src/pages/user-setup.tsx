import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

const UserSetup = () => {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const updateUserMutation = trpc.user.update.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      await updateUserMutation.mutateAsync({
        username
      })
      router.push('/user-setup#')
    } catch (e: any) {
      if (e.data.code === 'BAD_REQUEST') {
        setErrorMessage(e.message)
      }
    }

    setIsUpdating(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        minLength={3}
        maxLength={20}
        required
        className='text-black'
      />
      <button type='submit'>Complete</button>
    </form>
  )
}

export default UserSetup
