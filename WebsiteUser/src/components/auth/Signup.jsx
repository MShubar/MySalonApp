import styled from 'styled-components'
import TopBar from '../layout/TopBar'
import useSignUp from '../../functionality/auth/UseSignUp'
import { useForm } from 'react-hook-form'

const Container = styled.div`
  max-width: 500px;
  margin: 5rem auto;
  padding: 2rem;
  background-color: #1f1f1f;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  color: #f0f8ff;
`

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #4f8ef7;
  font-weight: 700;
`

const FormGroup = styled.div`
  margin: 0 0 1.2rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.95rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background-color: #121212;
  color: #f0f8ff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4f8ef7;
  }
`

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  font-style: italic;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  background-color: #4f8ef7;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(79, 142, 247, 0.4);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3a75d8;
  }
`

const FooterText = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
`

const SignInLink = styled.a`
  color: #4f8ef7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
const SignUp = () => {
  const { t, error, handleSignUp } = useSignUp()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    handleSignUp({
      email: data.email,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword
    })
  }

  return (
    <>
      <TopBar />
      <Container>
        <Heading>{t('Sign Up')}</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label>{t('Username')}</Label>
            <Input
              type="text"
              {...register('username', { required: t('Username is required') })}
              placeholder={t('Enter your username')}
            />
            {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>{t('Email Address')}</Label>
            <Input
              type="email"
              {...register('email', { required: t('Email is required') })}
              placeholder={t('Enter your email')}
            />
            {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>{t('Password')}</Label>
            <Input
              type="password"
              {...register('password', { required: t('Password is required') })}
              placeholder={t('Enter your password')}
            />
            {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label>{t('Confirm Password')}</Label>
            <Input
              type="password"
              {...register('confirmPassword', {
                required: t('Confirm Password is required'),
                validate: (value) =>
                  value === watch('password') || t('Passwords do not match')
              })}
              placeholder={t('Confirm your password')}
            />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword.message}</ErrorText>
            )}
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <SubmitButton type="submit">{t('Sign Up')}</SubmitButton>
        </form>

        <FooterText>
          {t('Already have an account?')}{' '}
          <SignInLink href="/signin">{t('Sign In')}</SignInLink>
        </FooterText>
      </Container>
    </>
  )
}

export default SignUp
