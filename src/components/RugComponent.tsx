import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  reloadCart: boolean;
  setReloadCart: Function;
}) {
  const [inCart, setInCart] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch(`/api/cart/${props.rug.id}`).then((res) => {
      setInCart(res.ok);
    });
  }, [props.reloadCart]);

  const addToCart = () => {
    fetch("/api/cart", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": props.cookies.get("csrftoken"),
      },
      body: JSON.stringify({ rug: props.rug.id }),
    }).then((res) => {
      if (res.ok) {
        navigate("/cart");
      } else {
        navigate("/login");
      }
    });
  };

  const deleteFromCart = () => {
    fetch(`api/cart/${props.rug.id}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "X-CSRFToken": props.cookies.get("csrftoken"),
      },
    }).then((res) => {
      if (res.ok) {
        props.setReloadCart(!props.reloadCart);
      } else {
        navigate("/login");
      }
    });
  };

  const goToRugPage = () => {
    navigate(`/rug/${props.rug.id}`);
  };

  return (
    <Card className='m-3'>
      <Card.Img
        onClick={goToRugPage}
        style={{ cursor: "pointer" }}
        variant='top'
        src={props.rug.image_url}
      />
      <Card.Body>
        <Card.Title as='a' onClick={goToRugPage} style={{ cursor: "pointer" }}>
          {props.rug.title}
        </Card.Title>
        <Card.Text>{`$${props.rug.price}`}</Card.Text>
        {props.isAuthenticated ? (
          inCart ? (
            <>
              <Card.Text>This rug is in your cart</Card.Text>
              <p>
                <Button onClick={() => navigate("/cart")}>View cart</Button>
              </p>
              <p>
                <Button variant='warning' onClick={deleteFromCart}>
                  Remove from cart
                </Button>
              </p>
            </>
          ) : (
            <Button onClick={addToCart}>Add to cart</Button>
          )
        ) : (
          <div>
            <Link to={`login?next=${location.pathname}`}>Login</Link>
            {" or"}{" "}
            <Link to={`register?next=${location.pathname}`}>sign up</Link> to
            buy
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default withCookies(RugComponent);
