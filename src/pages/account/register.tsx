import { Header } from '@/components/header'
import { FormEvent, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [repassword, setRepassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [uniqueErrorMessage, setUniqueErrorMessage] = useState('')
  const [internalError, setInternalError] = useState(false)
  const register = trpc.useMutation(['user.register'])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordErrorMessage('')
    setUniqueErrorMessage('')
    setInternalError(false)

    if (repassword !== password) {
      setPasswordErrorMessage('Passwords needs to be matching.')
    }

    try {
      await register.mutateAsync({ email, username, password })
    } catch (e: any) {
      if (e.data.code === 'BAD_REQUEST') {
        setUniqueErrorMessage(e.message)
      } else if (e.data.code === 'INTERNAL_SERVER_ERROR') {
        setInternalError(true)
      }
      return
    }

    router.push('/account/login')
  }

  return (
    <>
      <Header />
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-[#110c21] w-1/3 shadow flex justify-center items-center min-h-[70vh]'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center justify-center flex-col'
          >
            <span>Account</span>
            <label>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Confirm password</label>
            <input
              type='password'
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
            />
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Register
