import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { API_URL } from '../../config';
import ButtonWithIcon from '../ButtonWithIcon';

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  background: transparent;
  gap: 50px;
  flex-direction: row;
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-top: 2rem;
    gap: 20px;
  }

  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

const Box = styled.div`
  width: 100%;
  max-width: 900px;
  background-color: #1f1f1f;
  padding: 2rem;
  border-radius: 1rem;
  color: #f0f8ff;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 1rem;
    max-width: 100%;
  }
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #4f8ef7;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background-color: #2b2b2b;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #4f8ef7;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  background-color: #2b2b2b;
  border: 1px solid #444;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  outline: none;
  resize: none;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #4f8ef7;
  }
`;

const Alert = styled.div`
  background-color: ${(props) =>
    props.type === 'success' ? '#198754' : '#dc3545'};
  color: #fff;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const MapWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 3rem;
  border-radius: 1rem;
  background-color: #2b2b2b;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  overflow: hidden;

  @media (max-width: 600px) {
    margin-top: 2rem;
  }
`;

const ContactUs = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', comment: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', comment: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('Contact Us')}</title>
        <meta
          name="description"
          content="Get in touch with the MySalon team. We'd love to hear from you."
        />
      </Helmet>

      <Wrapper>
        <Box>
          <Heading>{t('Contact Us')}</Heading>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="name">{t('Name')}</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('Enter your name')}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">{t('Email')}</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('Enter your email')}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="comment">{t('Comment')}</Label>
              <TextArea
                id="comment"
                name="comment"
                rows="4"
                value={form.comment}
                onChange={handleChange}
                placeholder={t('Write your message')}
                required
              />
            </FormGroup>
            {status === 'success' && (
              <Alert type="success">{t('Message sent successfully!')}</Alert>
            )}
            {status === 'error' && (
              <Alert type="error">{t('Something went wrong')}</Alert>
            )}
            <ButtonWithIcon type="book" width="100%">
              {t('Submit')}
            </ButtonWithIcon>
          </form>
        </Box>

        <MapWrapper>
          <iframe
            title="Salon Location"
            src="https://www.google.com/maps?q=New+York+City&output=embed"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </MapWrapper>
      </Wrapper>
    </>
  );
};

export default ContactUs;
