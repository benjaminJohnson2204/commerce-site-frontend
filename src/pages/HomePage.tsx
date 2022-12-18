import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RugComponent, { Rug } from '../components/RugComponent';
import SiteHeader from '../components/SiteHeader';
import store from '../store';
import authSlice from '../store/slices/auth';
import axiosService from '../utils';

interface User {
  username: string;
}

interface RugListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Rug[];
}

export default function HomePage(props: any) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();
  const [admin, setAdmin] = useState(false);
  const [rugsResponse, setRugsResponse] = useState<RugListResponse>();
  const [reloadCart, setReloadCart] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    axiosService
      .get(
        `/api/rug?status=av${
          searchParams.get('search')
            ? '&search=' + searchParams.get('search')
            : ''
        }${
          searchParams.get('ordering')
            ? '&ordering=' + searchParams.get('ordering')
            : ''
        }`
      )
      .then((res) => {
        setRugsResponse(res.data);
        setLoading(false);
      });

    axiosService
      .get(`/api/authenticated`)
      .then((res) => {
        setAuthenticated(true);
        setUser(res.data);
      })
      .catch((err) => {
        dispatch(authSlice.actions.setAuthToken(null));
        setAuthenticated(false);
      });

    axiosService
      .get(`/api/admin`)
      .then((res) => {
        setAdmin(true);
      })
      .catch((err) => {
        setAdmin(false);
      });
  }, [location]);

  const loadNextPage = () => {
    if (rugsResponse?.next) {
      setLoading(true);
      axiosService.get(rugsResponse?.next).then((res) => {
        setRugsResponse({
          ...res.data,
          results: [...rugsResponse.results, res.data.results],
        });
        setLoading(false);
      });
    }
  };

  const handleScroll = (e: any) => {
    if (
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop -
        50 <=
      document.documentElement.clientHeight
    ) {
      console.log('loading next...');
      loadNextPage();
    }
  };

  const search = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    searchParams.set('search', event.target[0].value);
    setSearchParams(searchParams);
  };

  const setOrdering = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    searchParams.set('ordering', event.target.value);
    setSearchParams(searchParams);
  };

  const clearSearch = (event: React.ChangeEvent<any>) => {
    navigate('/');
  };

  return (
    <div>
      <SiteHeader isAuthenticated={authenticated} reloadCart={reloadCart} />
      <div className='page'>
        <Container fluid={true} className='g-3'>
          <h1 className='m-4'>Welcome, {(user && user.username) || 'guest'}</h1>

          <Row className='justify-content-center mb-3'>
            <Form className='d-flex' onSubmit={search}>
              <Form.Control
                defaultValue={
                  searchParams.get('search') === undefined
                    ? ''
                    : searchParams.get('search') || ''
                }
                name='search'
                type='search'
                placeholder='Search for a rug'
                className='search-input'
                aria-label='Search'
              />
              <Button variant='secondary' type='submit'>
                Search
              </Button>
            </Form>
          </Row>

          <Row className='justify-content-center mb-3'>
            <h5 className='mx-3'>Order results by </h5>
            <Form.Select
              className='order-results-dropdown'
              aria-label='Order results'
              onChange={setOrdering}
              defaultValue={searchParams.get('ordering') || '-date_created'}
            >
              <option value='-date_created'>Most recently posted</option>
              <option value='price'>Price: low to high</option>
              <option value='-price'>Price: high to low</option>
              <option value='title'>Title: A-Z</option>
              <option value='-title'>Title: Z-A</option>
            </Form.Select>
          </Row>

          <Row>
            <Col xs={12}>
              <h3>
                {rugsResponse?.results.length || 0}{' '}
                {searchParams.get('search')
                  ? `rugs found for "${searchParams.get('search')}"`
                  : 'available rugs'}
              </h3>
              {searchParams.get('search') && (
                <Button onClick={clearSearch} variant='success'>
                  See all rugs
                </Button>
              )}
            </Col>
          </Row>

          <Row>
            {rugsResponse?.results.map((rug) => (
              <Col xs={12} sm={6} md={4} xl={3}>
                <RugComponent
                  rug={rug}
                  isAuthenticated={authenticated}
                  reloadCart={reloadCart}
                  setReloadCart={setReloadCart}
                />
              </Col>
            ))}
          </Row>

          {loading && <h3>Loading...</h3>}

          {admin && (
            <Button as='a' variant='info' href='/add-rug'>
              Add a new rug
            </Button>
          )}
        </Container>
      </div>
    </div>
  );
}
