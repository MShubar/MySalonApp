import React, { useEffect, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useEditProfile from '../../functionality/auth/UseEditProfile';
import Cropper from 'react-easy-crop';
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

  &:hover {
    background-color: #3a75d8;
  }
`;

const ErrorText = styled.div`
  color: #f44336;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  font-style: italic;
`;

const SuccessText = styled.div`
  color: #4caf50;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 0.25em solid #f3f3f3;
  border-top: 0.25em solid #fff;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: ${spin} 0.6s linear infinite;
  margin: 2rem auto;
`;

const CropWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: #333;
  margin-bottom: 1rem;
`;

const Preview = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin: 1rem auto;
`;

function EditProfile({ userId }) {
  const navigate = useNavigate();
  const {
    t,
    formData,
    avatarUrl,
    loading,
    error,
    success,
    handleChange,
    handleAvatarChange,
    handleSubmit,
  } = useEditProfile({ userId });

  const [imageSrc, setImageSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const showCroppedImage = useCallback(() => {
    if (!imageSrc || !croppedAreaPixels) return;
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      const base64 = canvas.toDataURL('image/jpeg');
      handleChange({ name: 'photo', value: base64 });
      setImageSrc('');
    };
  }, [imageSrc, croppedAreaPixels, handleChange]);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Helmet>
        <title>{t('Edit Profile')}</title>
      </Helmet>
      <Wrapper>
        <Container>
          <Heading>{t('Edit Profile')}</Heading>

          {loading ? (
            <Spinner />
          ) : (
            <form onSubmit={onSubmit}>
              {error && <ErrorText>{error}</ErrorText>}
              {success && <SuccessText>{success}</SuccessText>}

              <FormGroup>
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

              <FormGroup>
                {imageSrc ? (
                  <>
                    <CropWrapper>
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </CropWrapper>
                    <SubmitButton type="button" onClick={showCroppedImage}>
                      {t('Apply Crop')}
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    {formData.photo && (
                      <Preview
                        src={formData.photo}
                        alt={t('Profile preview')}
                      />
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </FormGroup>

              <SubmitButton type="submit">{t('Save Changes')}</SubmitButton>
            </form>
          )}
        </Container>
      </Wrapper>
    </>
  );
}

EditProfile.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default EditProfile;
