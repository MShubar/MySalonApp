import React, { useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import useEditProfile from '../../functionality/auth/UseEditProfile'

const PageContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  border-radius: 0.5rem;
  color: #f0f0f0;
`

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #222;
  font-weight: 700;
`

const Card = styled.div`
  background-color: #2a2a2a;
  color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #4f8ef7;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1rem;
  &:hover {
    text-decoration: underline;
  }
`

const FormGroup = styled.div`
  margin-bottom: 1rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
`

const Input = styled.input`
  width: 100%;
  background-color: #1e1e1e;
  border: 1px solid #444;
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.25rem;

  &:focus {
    outline: none;
    border-color: #80b3ff;
  }
`

const Button = styled.button`
  background-color: #0d6efd;
  color: #fff;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #0b5ed7;
  }
`

const Alert = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.type === 'danger' ? '#dc3545' : '#198754'};
  color: #fff;
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const Spinner = styled.div`
  border: 0.25em solid #f3f3f3;
  border-top: 0.25em solid #fff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: ${spin} 0.6s linear infinite;
  margin: 2rem auto;
`

function EditProfile({ userId }) {
  const navigate = useNavigate()
  const { t, formData, loading, error, success, handleChange, handleSubmit } =
    useEditProfile({ userId })

  useEffect(() => {
    document.body.style.backgroundColor = '#121212'
    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <PageContainer>
      <BackButton onClick={() => navigate(-1)}>&larr; {t('Back')}</BackButton>
      <Heading>{t('Edit Profile')}</Heading>

      <Card>
        {loading ? (
          <Spinner />
        ) : (
          <form onSubmit={onSubmit}>
            {error && <Alert type="danger">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <FormGroup>
              <Label>{t('Username')}</Label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                required
                placeholder={t('Enter username')}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('Email')}</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                required
                placeholder={t('Enter email')}
              />
            </FormGroup>

            <Button type="submit">{t('Save Changes')}</Button>
          </form>
        )}
      </Card>
    </PageContainer>
  )
}

export default EditProfile
