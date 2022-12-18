import { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Button } from 'react-bootstrap';
import { Cookies, withCookies } from 'react-cookie';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Rug } from '../components/RugComponent';
import SiteHeader from '../components/SiteHeader';
import axiosService from '../utils';

function RugPage(props: { cookies: Cookies }) {
  const [rug, setRug] = useState<Rug>();
  const [inCart, setInCart] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [reload, setReload] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axiosService.get(`/api/rug/${id}`).then((res) => setRug(res.data));

    axiosService
      .get(`/api/cart/${id}`) // Check if rug is in the user's cart
      .then((res) => {
        setInCart(true);
        setAuthenticated(true);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setInCart(false);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      });
  }, [reload]);

  const addToCart = () => {
    axiosService
      .post(`/api/cart`, {
        rug: id,
      })
      .then((res) => {
        navigate('/cart');
      })
      .catch((err) => {
        navigate('/login');
      });
  };

  const deleteFromCart = () => {
    axiosService
      .delete(`api/cart/${rug!.id}`)
      .then((res) => setReload(!reload));
  };

  return (
    <div>
      <SiteHeader isAuthenticated={authenticated} />
      <div className='page'>
        {rug === undefined ? (
          'Loading...'
        ) : (
          <Container
            fluid={true}
            className='m-3 justify-content-center align-items-center'
          >
            <Row>
              {rug.image_url && (
                <Col xs={12} md={6}>
                  <Image src={rug.image_url} width='100%' height='100%' />
                </Col>
              )}
              <Col xs={12} md={6}>
                <h4
                  className={
                    rug.status === 'av' ? 'text-success' : 'text-error'
                  }
                >
                  {rug.status === 'av' ? 'Available' : 'Not available'}
                </h4>
                <h2>{rug.title}</h2>
                <p>{`$${rug.price}`}</p>
                <p>{rug.description}</p>
                {authenticated ? (
                  inCart ? (
                    <>
                      <p>This rug is in your cart</p>
                      <p>
                        <Button onClick={() => navigate('/cart')}>
                          View cart
                        </Button>
                      </p>
                      <p>
                        <Button variant='warning' onClick={deleteFromCart}>
                          Remove from cart
                        </Button>
                      </p>
                    </>
                  ) : (
                    <>
                      {rug.status === 'av' ? (
                        <Button onClick={addToCart}>Add to cart</Button>
                      ) : (
                        ''
                      )}
                    </>
                  )
                ) : (
                  <div>
                    <Link to={`login?next=${location.pathname}`}>Login</Link>
                    {' or'}{' '}
                    <Link to={`register?next=${location.pathname}`}>
                      sign up
                    </Link>{' '}
                    to buy
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </div>
  );
}

export default withCookies(RugPage);
