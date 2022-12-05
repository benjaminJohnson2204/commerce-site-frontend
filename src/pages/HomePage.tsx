import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import RugComponent, { Rug } from "../components/RugComponent";
import SiteHeader from "../components/SiteHeader";

interface User {
  username: string;
}

export default function HomePage(props: any) {
  const [loading, setLoading]: [boolean, Function] = useState(false);
  const [authenticated, setAuthenticated]: [boolean, Function] =
    useState(false);
  const [user, setUser] = useState<User>();
  const [admin, setAdmin] = useState(false);
  const [rugs, setRugs]: [Rug[], Function] = useState([]);
  const [reloadCart, setReloadCart] = useState(false);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    Promise.all([
      fetch(
        `/api/rug?status=av${
          searchParams.get("search")
            ? "&search=" + searchParams.get("search")
            : ""
        }${
          searchParams.get("ordering")
            ? "&ordering=" + searchParams.get("ordering")
            : ""
        }`
      ).then((res) => res.json()),
      fetch("/api/authenticated"),
      fetch("/api/admin"),
    ]).then((responses) => {
      setRugs(responses[0]["results"]);
      setLoading(false);

      if (responses[1].ok) {
        setAuthenticated(true);
        responses[1].json().then((data) => setUser(data));
      } else {
        setAuthenticated(false);
      }

      if (responses[2].ok) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    });
  }, [useLocation()]);

  const search = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    searchParams.set("search", event.target[0].value);
    setSearchParams(searchParams);
  };

  const setOrdering = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    searchParams.set("ordering", event.target.value);
    setSearchParams(searchParams);
  };

  const clearSearch = (event: React.ChangeEvent<any>) => {
    navigate("/");
  };

  return (
    <div>
      <SiteHeader isAuthenticated={authenticated} reloadCart={reloadCart} />
      <div className='page'>
        {loading ? (
          "Loading..."
        ) : (
          <Container fluid={true} className='g-3'>
            <h1 className='m-4'>
              Welcome, {(user && user.username) || "guest"}
            </h1>

            <Row className='justify-content-center mb-3'>
              <Form className='d-flex' onSubmit={search}>
                <Form.Control
                  defaultValue={
                    searchParams.get("search") === undefined
                      ? ""
                      : searchParams.get("search") || ""
                  }
                  name='search'
                  type='search'
                  placeholder='Search for a rug'
                  className='me-2'
                  aria-label='Search'
                />
                <Button variant='outline-secondary' type='submit'>
                  Search
                </Button>
              </Form>
            </Row>

            <Row className='justify-content-center mb-3'>
              <h5 className='mx-3'>Order results by </h5>
              <Form.Select
                aria-label='Order results'
                onChange={setOrdering}
                defaultValue={searchParams.get("ordering") || "-date_created"}
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
                  {rugs.length || 0}{" "}
                  {searchParams.get("search")
                    ? `rugs found for "${searchParams.get("search")}"`
                    : "available rugs"}
                </h3>
                {searchParams.get("search") && (
                  <Button onClick={clearSearch} variant='success'>
                    See all rugs
                  </Button>
                )}
              </Col>
            </Row>

            <Row>
              {rugs.map((rug: Rug) => (
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

            {admin && (
              <Button as='a' variant='info' href='/add-rug'>
                Add a new rug
              </Button>
            )}
          </Container>
        )}
      </div>
    </div>
  );
}
