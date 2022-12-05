import { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Button } from 'react-bootstrap';
import { Cookies, withCookies } from 'react-cookie';
import { Rug } from '../components/RugComponent';
import SiteHeader from '../components/SiteHeader';
import axiosService from '../utils';

function CartPage(props: { cookies: Cookies }) {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState<number>();
  let [reloadCart, setReloadCart] = useState(false);

  useEffect(() => {
    axiosService.get(`/api/cart`).then((res) => {
      setCart(res.data['cart']);
      setTotalPrice(res.data['price']);
    });
  }, [reloadCart]);

  const deleteFromCart = (id: number) => {
    axiosService
      .delete(`/api/cart/${id}`)
      .then((res) => setReloadCart(!reloadCart));
  };

  const clearCart = () => {
    axiosService.delete(`/api/cart`).then((res) => setReloadCart(!reloadCart));
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} cartSize={cart.length} />
      <div className='page'>
        <h1 className='m-3'>Your Cart</h1>
        {cart === undefined ? (
          'Loading...'
        ) : (
          <Container fluid={true} className='m-3'>
            <Row>
              <Col xs={12} sm={6}>
                {cart.length ? (
                  <Container fluid={true}>
                    {cart.map((rug: Rug) => (
                      <Row>
                        <Col xs={12} md={6} lg={4}>
                          <Image
                            src={rug.image_url}
                            width='100%'
                            height='auto'
                          />
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                          <h4>{rug.title}</h4>
                          <p>{rug.description}</p>
                        </Col>
                        <Col xs={12} md={6} lg={4}>
                          <p>{`$${rug.price}`}</p>
                          <Button
                            variant='warning'
                            onClick={() => deleteFromCart(rug.id)}
                          >
                            Remove from Cart
                          </Button>
                        </Col>
                      </Row>
                    ))}
                    <Row>
                      <Col xs={12}>
                        <Button variant='danger' onClick={clearCart}>
                          Clear cart
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                ) : (
                  <Container fluid={true}>
                    <Row>
                      <Col xs={12}>
                        <h2>Your cart is empty</h2>
                      </Col>
                    </Row>
                  </Container>
                )}
              </Col>
              {cart.length > 0 && (
                <Col xs={12} sm={6}>
                  <p>Total: ${totalPrice}</p>
                  <Button as='a' href='/checkout'>
                    Checkout
                  </Button>
                </Col>
              )}
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
}

export default withCookies(CartPage);
