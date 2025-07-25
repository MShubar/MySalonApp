import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useChangePassword from '../../functionality/auth/useChangePassword';
import { Helmet } from 'react-helmet';

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

const Label = styled.label`
  display: block;
  margin-bottom: 0.25rem;
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

  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #3a75d8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  font-style: italic;
`;

const SuccessText = styled.div`
  color: #4caf50;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const Spinner = styled.div`
  border: 0.15em solid #f3f3f3;
  border-top: 0.15em solid #fff;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

function ChangePassword({ userId }) {
  const navigate = useNavigate();
  const { t, formData, loading, error, success, handleChange, handleSubmit } =
    useChangePassword({ userId });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <>
      <Helmet>
        <title>{t('Change Password')}</title>
      </Helmet>
      <Wrapper>
        <Container>
          <Heading>{t('Change Password')}</Heading>

          <form onSubmit={onSubmit}>
            {error && <ErrorText>{error}</ErrorText>}
            {success && <SuccessText>{success}</SuccessText>}

            <FormGroup>
              <Label>{t('Current Password')}</Label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                required
                placeholder={t('Enter current password')}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('New Password')}</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                required
                placeholder={t('Enter new password')}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('Confirm New Password')}</Label>
              <Input
                type="password"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={(e) =>
                  handleChange({ name: e.target.name, value: e.target.value })
                }
                required
                placeholder={t('Confirm new password')}
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading && <Spinner />} {t('Change Password')}
            </SubmitButton>
          </form>
        </Container>
      </Wrapper>
    </>
  );
}

ChangePassword.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default ChangePassword;
