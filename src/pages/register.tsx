import { Header } from '@/components/header'
import { FormEvent, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { useRouter } from 'next/router'
import { VscLoading } from 'react-icons/vsc'
import Link from 'next/link'

const Register = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [repassword, setRepassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [uniqueErrorMessage, setUniqueErrorMessage] = useState('')
  const [internalError, setInternalError] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const register = trpc.user.register.useMutation()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordErrorMessage('')
    setUniqueErrorMessage('')
    setInternalError(false)

    if (repassword !== password) {
      setPasswordErrorMessage('Passwords needs to be matching.')
    }

    try {
      setIsRegistering(true)
      await register.mutateAsync({ email, username, password })
      setIsRegistering(false)
    } catch (e: any) {
      setIsRegistering(false)
      if (e.data.code === 'BAD_REQUEST') {
        setUniqueErrorMessage(e.message)
      } else if (e.data.code === 'INTERNAL_SERVER_ERROR') {
        setInternalError(true)
      }
      return
    }

    router.push('/login')
  }

  return (
    <div className='w-full h-full overflow-hidden pb-14'>
      <Header />
      <div className='flex justify-center items-center min-h-screen'>
        <div className='bg-[#110c21] w-2/5 shadow flex justify-center items-center min-h-[70vh]'>
          <form
            onSubmit={handleSubmit}
            className='flex items-center justify-center flex-col'
          >
            <span className='text-4xl mb-10 tracking-wider font-bold'>REGISTER</span>
            <div className='flex flex-col mb-8'>
              <label
                htmlFor='email'
                className={`w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm font-bold ${
                  uniqueErrorMessage && 'text-red-600'
                }`}
              >
                EMAIL
              </label>
              <input
                type='email'
                className={`pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] focus:bg-[#262135] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:border-gray-800 ${
                  uniqueErrorMessage && 'border-red-600'
                }`}
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                id='email'
              />
              <span className='text-sm text-red-600 pt-2'>
                {uniqueErrorMessage && uniqueErrorMessage}
              </span>
            </div>
            <div className='flex flex-col mb-8'>
              <label
                htmlFor='username'
                className='w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm font-bold'
              >
                USERNAME
              </label>
              <input
                className='pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] focus:bg-[#262135] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:border-gray-800'
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                id='username'
              />
            </div>
            <div className='flex flex-col mb-8'>
              <label
                htmlFor='password'
                className={`w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm font-bold ${
                  passwordErrorMessage && 'text-red-600'
                }`}
              >
                PASSWORD
              </label>
              <input
                type='password'
                className={`pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] focus:bg-[#262135] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:border-gray-800 ${
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
            <div className='flex flex-col mb-2'>
              <label
                htmlFor='repassword'
                className={`w-max pt-2 pr-3 pl-3 pb-2 rounded-t-md text-sm font-bold ${
                  passwordErrorMessage && 'text-red-600'
                }`}
              >
                CONFIRM PASSWORD
              </label>
              <input
                type='password'
                className={`pl-2 pt-1 pb-1 pr-2 bg-[#150d2c] focus:bg-[#262135] border-b-2 rounded-t-md text-lg hover:border-gray-800 focus:border-gray-800 ${
                  passwordErrorMessage && 'border-red-600'
                }`}
                value={repassword}
                required
                onChange={(e) => setRepassword(e.target.value)}
                id='repassword'
              />
              <span className='text-sm text-red-600 pt-2'>
                {passwordErrorMessage && passwordErrorMessage}
              </span>
            </div>
            <Link href={'/login'}>
              <span className='underline cursor-pointer mb-6'>Already have an account?</span>
            </Link>
            <button
              type='submit'
              className='bg-main-purple font-bold pt-3 pb-3 pl-10 pr-10 rounded-md shadow-md w-36 h-12 hover:bg-main-purple-dark flex justify-center'
            >
              {isRegistering ? (
                <VscLoading
                  size={25}
                  className='animate-spin'
                />
              ) : (
                'REGISTER'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
