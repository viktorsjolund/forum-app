import Header from '@/components/header'
import { TextField, FormControl, Button, Box, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [repassword, setRepassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPasswordErrorMessage('')

    if (repassword !== password) {
      setPasswordErrorMessage('Passwords needs to be matching.')
    }
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
              Account Register
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
              label='Username'
              variant='outlined'
              required
              margin='normal'
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
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
              error={Boolean(passwordErrorMessage)}
            />
            <TextField
              id='outlined-basic'
              label='Confirm Password'
              variant='outlined'
              required
              margin='normal'
              type='password'
              value={repassword}
              onChange={e => setRepassword(e.target.value)}
              focused
              error={Boolean(passwordErrorMessage)}
              helperText={passwordErrorMessage}
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

export default Register
