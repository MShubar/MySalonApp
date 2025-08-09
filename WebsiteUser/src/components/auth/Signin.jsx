import React, { useContext } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import TopBar from '../layout/TopBar';
import useSignIn from '../../functionality/auth/UseSignIn';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../context/UserContext'; // Corrected import
import ButtonWithIcon from '../ButtonWithIcon';

const Wrapper = styled.div`
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: transparent;
`;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  background-color: #1f1f1f;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  color: #f0f8ff;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #4f8ef7;
  font-weight: 700;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
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

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-style: italic;
`;

const FooterText = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
`;

const SignUpLink = styled.a`
  color: #4f8ef7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignIn = () => {
  const { setUser } = useContext(UserContext); // Correct context usage
  const { t, error, handleSignIn } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    handleSignIn({ username: data.username, password: data.password });
  };

  return (
    <>
      <TopBar />
      <Helmet>
        <title>{t('Sign In')}</title>
      </Helmet>

      <Wrapper>
        <Container>
          <Heading>{t('Sign In')}</Heading>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Input
                type="text"
                placeholder={t('Username')}
                {...register('username', { required: true })}
              />
              {errors.username && (
                <ErrorText>{t('Username is required')}</ErrorText>
              )}
            </FormGroup>

            <FormGroup>
              <Input
                type="password"
                placeholder={t('Password')}
                {...register('password', { required: true })}
              />
              {errors.password && (
                <ErrorText>{t('Password is required')}</ErrorText>
              )}
            </FormGroup>

            {error && <ErrorText>{error}</ErrorText>}

            <ButtonWithIcon type="signin" width="100%">
              {t('Sign In')}
            </ButtonWithIcon>
          </form>

          <FooterText>
            {t("Don't have an account?")}{' '}
            <SignUpLink href="/signup">{t('Sign Up')}</SignUpLink>
          </FooterText>
        </Container>
      </Wrapper>
    </>
  );
};

export default SignIn;
