import styled from 'styled-components'
import useCart from '../../functionality/cart/UseCart'

const Container = styled.div`
  max-width: 1200px;
  margin: 2rem auto 5rem auto;
  color: #ddd;
  padding-bottom: 5rem;
`

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #222;
  font-weight: 700;
`

const EmptyText = styled.p`
  text-align: center;
  font-style: italic;
  color: #6c757d;
`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const GridItem = styled.div`
  flex: 1 1 48%;
  max-width: 48%;

  @media (max-width: 768px) {
    flex: 1 1 100%;
    max-width: 100%;
  }
`

const Card = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  color: #ddd;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`

const Image = styled.img`
  height: 180px;
  object-fit: cover;
  width: 100%;
  border-bottom: 1px solid #444;
`

const Placeholder = styled.div`
  height: 180px;
  font-size: 48px;
  background-color: #6c757d;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Title = styled.h5`
  color: #a3c1f7;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: #bbb;
  min-height: 48px;
  margin-bottom: 0.5rem;
`

const QuantityBadge = styled.span`
  display: inline-block;
  background-color: #0dcaf0;
  color: #212529;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
`

const AdjustButtons = styled.div`
  display: flex;
  align-items: center;

  button {
    border: 1px solid #6c757d;
    background: none;
    color: #ddd;
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    cursor: pointer;

    &:hover {
      background-color: #333;
    }
  }

  span {
    margin: 0 0.5rem;
  }
`

const Price = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #a3c1f7;
  margin-bottom: 0.5rem;
`

const RemoveButton = styled.button`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-top: auto;
  width: 100%;

  &:hover {
    background-color: #dc3545;
    color: #fff;
  }
`

const CheckoutBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #1f1f1f;
  border-top: 1px solid #333;
  padding: 12px 20px;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ddd;
`

const CheckoutButton = styled.button`
  background-color: #198754;
  color: #fff;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #157347;
  }
`

const Cart = () => {
  const {
    t,
    groupedCart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeAllOfItem,
    goToCheckout
  } = useCart()

  return (
    <Container>
      <Heading>🛒 {t('Cart')} 🛒</Heading>

      {groupedCart.length === 0 ? (
        <EmptyText>{t('Cart is empty')}</EmptyText>
      ) : (
        <Grid>
          {groupedCart.map((item) => (
            <GridItem key={item.id + item.type}>
              <Card>
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name || item.title} />
                ) : (
                  <Placeholder>{item.name?.charAt(0)}</Placeholder>
                )}

                <CardBody>
                  <Title>{item.name || item.title}</Title>
                  <Description>
                    {item.description || t('No description available')}
                  </Description>

                  <div style={{ minHeight: '80px' }}>
                    <QuantityBadge>
                      {t('Quantity')}: {item.quantity}
                    </QuantityBadge>

                    <AdjustButtons>
                      <button
                        onClick={() => decreaseQuantity(item.id, item.type)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item)}>+</button>
                    </AdjustButtons>
                  </div>

                  <Price>
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} BHD
                  </Price>

                  <RemoveButton
                    onClick={() => removeAllOfItem(item.id, item.type)}
                  >
                    🗑️ {t('Remove All')}
                  </RemoveButton>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>
      )}

      {groupedCart.length > 0 && (
        <CheckoutBar>
          <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
            {t('Total')}: {total.toFixed(2)} BHD
          </div>
          <CheckoutButton onClick={goToCheckout}>
            💳 {t('Checkout')}
          </CheckoutButton>
        </CheckoutBar>
      )}
    </Container>
  )
}

export default Cart
