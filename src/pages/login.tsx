import { Header } from '@/components/header'
import { trpc } from '@/utils/trpc'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const login = trpc.useMutation(['user.login'])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEmailErrorMessage('')
    setPasswordErrorMessage('')

    try {
      setIsLoggingIn(true)
      await login.mutateAsync({ email, password })
      setIsLoggingIn(false)
    } catch (e: any) {
      setIsLoggingIn(false)
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
    <div className='w-full h-full overflow-hidden pb-14'>
      <Header />
      <div className='flex justify-center items-center h-full'>
        <div className='bg-[#110c21] w-1/3 shadow-lg rounded-lg flex justify-center items-center min-h-[70vh]'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center justify-center flex-col'
          >
            <span className='text-4xl mb-10 tracking-wider font-bold'>LOGIN</span>
            <div className='flex flex-col mb-8'>
              <label
                htmlFor='email'
                className={`w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm ${
                  emailErrorMessage && 'text-red-600'
                }`}
              >
                EMAIL
              </label>
              <input
                type='email'
                className={`pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:bg-[#262135] focus:border-gray-800 ${
                  emailErrorMessage && 'border-red-600'
                }`}
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                id='email'
              />
              <span className='text-sm text-red-600 pt-2'>
                {emailErrorMessage && emailErrorMessage}
              </span>
            </div>
            <div className='flex flex-col mb-2'>
              <label
                htmlFor='password'
                className={`w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm ${
                  passwordErrorMessage && 'text-red-600'
                }`}
              >
                PASSWORD
              </label>
              <input
                type='password'
                className={`pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:border-gray-800 focus:bg-[#262135] ${
                  passwordErrorMessage && 'border-red-600'
                }`}
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                id='password'
              />
              <span className='text-sm text-red-600 pt-2'>
                {passwordErrorMessage && passwordErrorMessage}
              </span>
            </div>
            <Link href={'/register'}>
              <span className='underline mb-6 cursor-pointer'>Create an account</span>
            </Link>
            <button
              type='submit'
              className='bg-main-purple font-bold pt-3 pb-3 pl-10 pr-10 rounded-md shadow-md w-36 h-12 hover:bg-main-purple-dark flex justify-center'
            >
              {isLoggingIn ? (
                <VscLoading
                  size={25}
                  className='animate-spin'
                />
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
