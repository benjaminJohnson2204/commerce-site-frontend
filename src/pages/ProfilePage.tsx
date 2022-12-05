import { Field, Formik, Form, FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { getDayMonthYear, getTime } from "../utils";
import { Order } from "./OrderPage";

function ProfilePage(props: { cookies: Cookies }) {
  const navigate = useNavigate();

  const [orders, setOrders]: [Order[], Function] = useState([]);
  const [emailsNewRugs, setEmailsNewRugs] = useState(false);
  const [preferenceUpdates, setPreferenceUpdates] = useState(0);

  useEffect(() => {
    fetch("/api/order")
      .then((res) => res.json())
      .then((data) => setOrders(data["results"]));
  }, []);

  useEffect(() => {
    fetch("/api/authenticated")
      .then((res) => res.json())
      .then((data) => setEmailsNewRugs(data["receive_emails_new_rugs"]));
  }, [preferenceUpdates]);

  const goToOrderPage = (id: number) => {
    navigate(`/order/${id}`);
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Your Orders</h1>
        {orders ? (
          orders.length > 0 ? (
            <Container className='m-3'>
              <Row>
                <Col>
                  <strong>Number of rugs</strong>
                </Col>
                <Col>
                  <strong>Total price</strong>
                </Col>
                <Col>
                  <strong>Date placed</strong>
                </Col>
                <Col>
                  <strong>Status</strong>
                </Col>
              </Row>
              {orders.map((order) => (
                <Row
                  xs={1}
                  sm={2}
                  lg={4}
                  onClick={() => goToOrderPage(order.id)}
                  style={{ cursor: "pointer" }}
                >
                  <Col>{order.rugs.length}</Col>
                  <Col>${order.price}</Col>
                  <Col>
                    {`${getDayMonthYear(order.date_placed)} at ${getTime(
                      order.date_placed
                    )}`}
                  </Col>
                  <Col>
                    {order.status === "pe"
                      ? "Pending"
                      : order.status === "co"
                      ? "Complete"
                      : "Ready for pickup"}
                  </Col>
                </Row>
              ))}
            </Container>
          ) : (
            <h2>You haven't made any orders yet</h2>
          )
        ) : (
          "Loading..."
        )}
        <h1 className='m-3'>Your email preferences</h1>
        <Formik
          initialValues={{ receive_emails_new_rugs: emailsNewRugs }}
          enableReinitialize={true}
          onSubmit={(
            values: { receive_emails_new_rugs: boolean },
            {
              setSubmitting,
            }: FormikHelpers<{ receive_emails_new_rugs: boolean }>
          ) => {
            setTimeout(() => {
              if (values.receive_emails_new_rugs !== emailsNewRugs) {
                fetch("/api/user", {
                  credentials: "include",
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": props.cookies.get("csrftoken"),
                  },
                  body: JSON.stringify(values),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setPreferenceUpdates(preferenceUpdates + 1);
                  });
              }
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <Field type='checkbox' name='receive_emails_new_rugs' />
                Email me when new rugs are available to buy
              </label>
              <p />
              <Button disabled={isSubmitting} type='submit'>
                Update prefernces
              </Button>
            </Form>
          )}
        </Formik>
        {preferenceUpdates > 0 && (
          <p className='text-success'>
            Your email preferences have been changed
          </p>
        )}
      </div>
    </div>
  );
}

export default withCookies(ProfilePage);
