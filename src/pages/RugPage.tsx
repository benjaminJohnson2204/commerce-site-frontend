import { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Rug } from "../components/RugComponent";
import SiteHeader from "../components/SiteHeader";

function RugPage(props: { cookies: Cookies }) {
  const [rug, setRug] = useState<Rug>();
  const [inCart, setInCart] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [reload, setReload] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`/api/rug/${id}`)
      .then((res) => res.json())
      .then((data) => setRug(data));

    fetch(`/api/cart/${id}`) // Check if rug is in the user's cart
      .then((res) => {
        if (res.ok) {
          setInCart(true);
          setAuthenticated(true);
        } else if (res.status === 404) {
          setInCart(false);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      });
  }, [reload]);

  const addToCart = () => {
    fetch("/api/cart", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.cookies.get("csrftoken"),
      },
      body: JSON.stringify({ rug: id }),
    }).then((res) => {
      if (res.ok) {
        navigate("/cart");
      } else {
        navigate("/login");
      }
    });
  };

  const deleteFromCart = () => {
    fetch(`api/cart/${rug!.id}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "X-CSRFToken": props.cookies.get("csrftoken"),
      },
    }).then((res) => setReload(!reload));
  };

  return (
    <div>
      <SiteHeader isAuthenticated={authenticated} />
      <div className='page'>
        {rug === undefined ? (
          "Loading..."
        ) : (
          <Container
            fluid={true}
            className='m-3 justify-content-center align-items-center'
          >
            <Row>
              {rug.image_url && (
                <Col xs={12} md={6}>
                  <Image src={rug.image_url} width='100%' height='auto' />
                </Col>
              )}
              <Col xs={12} md={6}>
                {rug.status === "av" ? "Available" : "Not available"}
                <h2>{rug.title}</h2>
                <p>{`$${rug.price}`}</p>
                <p>{rug.description}</p>
                {authenticated ? (
                  inCart ? (
                    <>
                      <p>This rug is in your cart</p>
                      <p>
                        <Button onClick={() => navigate("/cart")}>
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
                      {rug.status === "av" ? (
                        <Button onClick={addToCart}>Add to cart</Button>
                      ) : (
                        ""
                      )}
                    </>
                  )
                ) : (
                  <div>
                    <Link to={`login?next=${location.pathname}`}>Login</Link>
                    {" or"}{" "}
                    <Link to={`register?next=${location.pathname}`}>
                      sign up
                    </Link>{" "}
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
