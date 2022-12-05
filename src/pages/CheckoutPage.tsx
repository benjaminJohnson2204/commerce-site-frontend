import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Button, Form } from 'react-bootstrap';
import { Cookies, withCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { Rug } from '../components/RugComponent';
import SiteHeader from '../components/SiteHeader';
import axiosService from '../utils';

function CheckoutPage(props: { cookies: Cookies }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [passwordVerified, setPasswordVerified] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState<number>();
  const [error, setError] = useState('');

  useEffect(() => {
    axiosService.get(`/api/cart`).then((res) => {
      if (!res.data['cart'].length) {
        navigate('/cart');
      }
      setCart(res.data['cart']);
      setTotalPrice(res.data['price']);
    });
  }, []);

  const verifyPassword = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    axiosService
      .post(`/api/verify-password`, {
        password: event.target[0].value,
      })
      .then((res) => {
        setPasswordVerified(true);
      })
      .catch((err) => {
        setInvalid(true);
      });
  };

  const placeOrder = () => {
    axiosService
      .post(`/api/order`)
      .then((res) => {
        navigate(`/order/${res.data['id']}`);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate(`/login?next=${location.pathname}`);
        } else {
          setError(err.response.data);
        }
      });
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Checkout</h1>
        {passwordVerified ? (
          <>
            <h4>Review your cart</h4>
            {cart === undefined ? (
              'Loading...'
            ) : (
              <Container fluid={true} className='m-3'>
                <Row>
                  <Col xs={12} sm={6}>
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
                          </Col>
                        </Row>
                      ))}
                      <Row>
                        <Col xs={12}>
                          <Button as='a' href='/cart'>
                            Edit Cart
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Col>
                  <Col xs={12} sm={6}>
                    <p>Total: ${totalPrice}</p>
                    <Button variant='success' onClick={placeOrder}>
                      Place Order
                    </Button>
                    {error &&
                      'There was a problem placing your order: ' + error}
                  </Col>
                </Row>
              </Container>
            )}
          </>
        ) : (
          <>
            <h4>Please verify your password to place an order</h4>
            <Form onSubmit={verifyPassword}>
              <Form.Group className='mb-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name='password'
                  placeholder='Password'
                  required={true}
                  type='password'
                />
              </Form.Group>
              <Button variant='success' type='submit'>
                Verify password
              </Button>
            </Form>
            {invalid && <div className='text-danger'>Incorrect password</div>}
          </>
        )}
      </div>
    </div>
  );
}

export default withCookies(CheckoutPage);
