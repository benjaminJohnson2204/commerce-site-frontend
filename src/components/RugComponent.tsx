import { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { Cookies, withCookies } from 'react-cookie';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axiosService from '../utils';

export interface Rug {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url?: string;
  status: string;
}

function RugComponent(props: {
  rug: Rug;
  cookies: Cookies;
  isAuthenticated: boolean;
  reloadCart: () => void;
  inCart: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const addToCart = () => {
    axiosService
      .post(`/api/cart`, { rug: props.rug.id })
      .then((res) => {
        navigate('/cart');
      })
      .catch((err) => {
        navigate('/login');
      });
  };

  const deleteFromCart = () => {
    axiosService
      .delete(`/api/cart/${props.rug.id}`)
      .then((res) => {
        props.reloadCart();
      })
      .catch((err) => {
        navigate('/login');
      });
  };

  const goToRugPage = () => {
    navigate(`/rug/${props.rug.id}`);
  };

  return (
    <Card className='m-3 p-3 rug-component'>
      <Card.Img
        onClick={goToRugPage}
        style={{ cursor: 'pointer' }}
        variant='top'
        src={props.rug.image_url}
      />
      <Card.Body>
        <Card.Title
          as='a'
          onClick={goToRugPage}
          style={{ cursor: 'pointer', fontSize: 18, fontWeight: 600 }}
        >
          {props.rug.title}
        </Card.Title>
        <Card.Text>{`$${props.rug.price}`}</Card.Text>
        {props.isAuthenticated ? (
          props.inCart ? (
            <>
              <Card.Text>This rug is in your cart</Card.Text>
              <div>
                <Button className='m-1' onClick={() => navigate('/cart')}>
                  View cart
                </Button>
                <Button
                  className='m-1'
                  variant='danger'
                  onClick={deleteFromCart}
                >
                  <Trash />
                </Button>
              </div>
            </>
          ) : (
            <Button onClick={addToCart}>Add to cart</Button>
          )
        ) : (
          <div>
            <Link to={`login?next=${location.pathname}`}>Login</Link>
            {' or'}{' '}
            <Link to={`register?next=${location.pathname}`}>sign up</Link> to
            buy
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default withCookies(RugComponent);
