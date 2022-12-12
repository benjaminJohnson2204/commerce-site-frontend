import { useEffect, useState } from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import authSlice from '../store/slices/auth';
import axiosService from '../utils';

export default function SiteHeader(props: {
  isAuthenticated?: boolean;
  cartSize?: number;
  reloadCart?: boolean;
}) {
  const location = useLocation();
  const [cartSize, setCartSize] = useState(props.cartSize || 0);
  const [authenticated, setAuthenticated] = useState(
    props.isAuthenticated || false
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.cartSize === undefined) {
      axiosService
        .get(`/api/cart`)
        .then((res) => setCartSize(res.data['count']));
    } else {
      setCartSize(props.cartSize);
    }
  }, [props.cartSize]);

  useEffect(() => {
    axiosService.get(`/api/cart`).then((res) => setCartSize(res.data['count']));
  }, [props.reloadCart]);

  useEffect(() => {
    if (props.isAuthenticated === undefined) {
      axiosService
        .get(`/api/authenticated`)
        .then((res) => {
          setAuthenticated(true);
        })
        .catch((err) => {
          setAuthenticated(false);
        });
    } else {
      setAuthenticated(props.isAuthenticated);
    }
  }, [props.isAuthenticated]);

  const logout = () => {
    axiosService.post(`/api/logout`).then((res) => {
      dispatch(authSlice.actions.setAuthToken(null));
      window.location.reload();
    });
  };

  return (
    <Navbar collapseOnSelect bg='success' variant='dark' expand='lg'>
      <Container fluid>
        <Navbar.Brand href='/'>Home</Navbar.Brand>
        <Navbar.Toggle aria-controls='my-navbar' />
        <Navbar.Collapse id='my-navbar'>
          <Nav className='me-auto'>
            <Navbar.Brand
              href='https://github.com/benjaminJohnson2204/rugs-website'
              rel='noopener noreferrer'
              target='_blank'
            >
              View Source Code
            </Navbar.Brand>
          </Nav>
        </Navbar.Collapse>

        <Navbar.Collapse className='justify-content-end'>
          {authenticated ? (
            <Nav>
              <Navbar.Brand href='/profile'>Profile</Navbar.Brand>
              <Navbar.Brand href='/cart'>
                Cart <Badge bg='primary'>{cartSize}</Badge>
              </Navbar.Brand>
              <Navbar.Brand href='#' onClick={logout}>
                Logout
              </Navbar.Brand>
            </Nav>
          ) : (
            <Nav>
              <Navbar.Brand href={`/login?next=${location.pathname}`}>
                Login
              </Navbar.Brand>
              <Navbar.Brand href={`/register?next=${location.pathname}`}>
                Sign Up
              </Navbar.Brand>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
