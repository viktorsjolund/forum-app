import Header from '@/components/header'
import { TextField, FormControl, Button, Box, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <>
      <Header />
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='100vh'
      >
        <Box
          sx={{ backgroundColor: '#110c21', width: '30%', boxShadow: 4 }}
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='70vh'
        >
          <FormControl
            component='form'
            onSubmit={handleSubmit}
            sx={{ label: { color: 'white' }, alignItems: 'center', justifyContent: 'center' }}
          >
            <Typography
              variant='h4'
              color='white'
            >
              Account
            </Typography>
            <TextField
              id='outlined-basic'
              label='Email'
              variant='outlined'
              required
              margin='normal'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              focused
            />
            <TextField
              id='outlined-basic'
              label='Password'
              variant='outlined'
              required
              margin='normal'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              focused
            />
            <Button
              type='submit'
              variant='outlined'
              sx={{ width: '170px', height: '40px', mt: '10px', bgcolor: 'white' }}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </Box>
    </>
  )
}

export default Login
