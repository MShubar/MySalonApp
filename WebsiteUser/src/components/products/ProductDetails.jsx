import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useProductDetails from '../../functionality/products/UseProductDetails'
import ServerError from '../ServerError'

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  color: #f0f8ff;
`

const Card = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Image = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #444;
`

const Placeholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #555;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #ccc;
`

const Title = styled.h2`
  color: #a3c1f7;
  margin: 0;
`

const Price = styled.p`
  color: #f0e68c;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 0;
`

const BackButton = styled.button`
  align-self: flex-start;
  background: transparent;
  color: #f0f8ff;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
`

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { product, loading, error, retry } = useProductDetails(id)

  if (loading) {
    return (
      <div className="text-center mt-5">
        {t('Loading product details...')}
      </div>
    )
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />
    }
    return (
      <div className="text-center mt-5 text-danger">
        {t('Failed to load product')}
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center mt-5 text-muted">
        {t('Product not found')}
      </div>
    )
  }

  return (
    <Container>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <BackButton onClick={() => navigate(-1)}>← {t('Back')}</BackButton>
      <Card>
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} />
        ) : (
          <Placeholder>{product.name.charAt(0)}</Placeholder>
        )}
        <div>
          <Title>{product.name}</Title>
          <p>{product.description}</p>
          <Price>{Number(product.price).toFixed(2)} BHD</Price>
          {product.salon_name && (
            <p>
              <strong>{t('Salon')}: </strong>
              {product.salon_name}
            </p>
          )}
          <p>
            <strong>{t('Available')}: </strong>
            {product.quantity}
          </p>
        </div>
      </Card>
    </Container>
  )
}

export default ProductDetails
