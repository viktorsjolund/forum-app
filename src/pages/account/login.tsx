import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const login = trpc.useMutation(['user.login'])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailErrorMessage('')
    setPasswordErrorMessage('')

    try {
      await login.mutateAsync({ email, password })
    } catch (e: any) {
      if (e.data.code === 'BAD_REQUEST') {
        setPasswordErrorMessage(e.message)
      } else if (e.data.code === 'NOT_FOUND') {
        setEmailErrorMessage(e.message)
      }
      return
    }

    router.push('/')
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
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
