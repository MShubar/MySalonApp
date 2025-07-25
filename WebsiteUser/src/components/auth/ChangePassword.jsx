import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import useChangePassword from '../../functionality/auth/useChangePassword'
import { Helmet } from 'react-helmet'

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
  margin: 0 0 1.2rem;
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
  display: inline-flex;
  align-items: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
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
`
function ChangePassword({ userId }) {
  const navigate = useNavigate()
  const { t, formData, loading, error, success, handleChange, handleSubmit } =
    useChangePassword({ userId })

  const onSubmit = (e) => {
    e.preventDefault()
    handleSubmit()
  }

  return (
    <PageContainer>
      <Helmet>
        <title>{t('Change Password')}</title>
      </Helmet>
      <BackButton onClick={() => navigate(-1)}>&larr; {t('Back')}</BackButton>
      <Heading>{t('Change Password')}</Heading>

      <Card>
        <form onSubmit={onSubmit}>
          {error && <Alert type="danger">{error}</Alert>}
          {success && <Alert type="success">{success}</Alert>}

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

          <Button type="submit" disabled={loading}>
            {loading && <Spinner />} {t('Change Password')}
          </Button>
        </form>
      </Card>
    </PageContainer>
  )
}

ChangePassword.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired
}

export default ChangePassword
