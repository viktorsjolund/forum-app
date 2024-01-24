import { Header } from '@/components/header'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { VscLoading } from 'react-icons/vsc'
import { signIn } from 'next-auth/react'
import { BsGithub, BsGoogle } from 'react-icons/bs'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div className='w-full h-full overflow-hidden pb-14'>
      <Header />
      <div className='flex justify-center items-center h-full bg-gradient-to-tr from-main-purple-light to-main-purple via-main-purple-dark'>
        <div className='bg-midnight-dark border-[1px] border-slate-700 w-1/3 shadow-lg rounded flex flex-col justify-center items-center min-h-[70vh]'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center justify-center flex-col border-b-[1px] pb-6 pr-4 pl-4 border-slate-700'
          >
            <span className='text-4xl mb-10 tracking-widest font-semibold'>SIGN IN</span>
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
                className={`pl-2 pt-1 pb-1 pr-2 bg-midnight border-[1px] border-slate-500 rounded text-lg hover:border-gray-800 focus:bg-[#262135] focus:border-gray-800 ${
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
                className={`pl-2 pt-1 pb-1 pr-2 bg-midnight border-[1px] border-slate-500 rounded text-lg hover:border-gray-800 focus:border-gray-800 focus:bg-[#262135] ${
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
            <Link href={'/auth/register'}>
              <span className='underline cursor-pointer hover:text-slate-300'>
                Create an account
              </span>
            </Link>
            <button
              type='submit'
              className='bg-main-purple mt-2 font-bold pt-3 pb-3 pl-10 pr-10 rounded-md shadow-md w-36 h-12 hover:bg-main-purple-dark flex justify-center'
              disabled
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
          <div className='flex h-fit w-fit pt-6'>
            <button
              onClick={() => signIn('github', { callbackUrl: '/' })}
              className='mr-2 p-2'
            >
              <BsGithub size={36} />
            </button>
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className='p-2'
            >
              <BsGoogle size={36} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
