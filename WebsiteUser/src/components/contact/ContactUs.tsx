import React, { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { API_URL } from '../../config'

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
  margin-bottom: 1rem;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background-color: #121212;
  color: #f0f8ff;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4f8ef7;
  }
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

const Message = styled.div`
  margin-top: 1rem;
  font-size: 0.95rem;
  color: ${(props) => (props.$error ? '#f44336' : '#28a745')};
  text-align: center;
`

const ContactUs = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, comment })
      })
      if (res.ok) {
        setMessage(t('Message sent successfully!'))
        setName('')
        setEmail('')
        setComment('')
      } else {
        const data = await res.json()
        setError(data.message || t('Something went wrong'))
      }
    } catch (err) {
      console.error(err)
      setError(t('Something went wrong'))
    }
  }

  return (
    <Container>
      <Heading>{t('Contact Us')}</Heading>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>{t('Name')}</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('Enter your name')}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('Email')}</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('Enter your email')}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>{t('Comment')}</Label>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t('Enter your comment')}
            required
          />
        </FormGroup>
        {error && <Message $error>{error}</Message>}
        {message && <Message>{message}</Message>}
        <SubmitButton type="submit">{t('Submit')}</SubmitButton>
      </form>
    </Container>
  )
}

export default ContactUs
