import {
  ErrorMessage,
  Field,
  Formik,
  FormikHelpers,
  Form as FormikForm,
} from "formik";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

interface RegisterValues {
  username: string;
  email: string;
  password: string;
  confirmation: string;
  receive_emails_order_updates: boolean;
  receive_emails_new_rugs: boolean;
}

function RegisterPage(props: { cookies: Cookies }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetch("/api/authenticated").then((res: Response) => {
      if (res.ok) {
        navigate(searchParams.get("next") || "/");
      }
    });
  }, [searchParams]);

  return (
    <div>
      <SiteHeader isAuthenticated={false} />
      <div className='page'>
        <h1 className='m-3'>Create an account</h1>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmation: "",
            receive_emails_order_updates: true,
            receive_emails_new_rugs: false,
          }}
          validate={(values: RegisterValues) => {
            const errors: any = {};
            if (!values.username) {
              errors.username = "Username is required";
            } else if (!values.email) {
              errors.email = "Email address is required";
            } else if (!/\S+@\S+\.\S+/.test(values.email)) {
              errors.email = "Not a valid email address";
            } else if (!values.password) {
              errors.password = "Password is required";
            } else if (!values.confirmation) {
              errors.confirmation = "Must confirm password";
            } else if (values.password !== values.confirmation) {
              errors.confirmation = "Passwords don't match";
            }
            return errors;
          }}
          onSubmit={(
            values: RegisterValues,
            { setSubmitting }: FormikHelpers<RegisterValues>
          ) => {
            setTimeout(() => {
              fetch("/api/register", {
                credentials: "include",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": props.cookies.get("csrftoken"),
                },
                body: JSON.stringify(values),
              })
                .then((res) => {
                  if (res.ok) {
                    navigate(searchParams.get("next") || "/");
                  } else {
                    return res.json();
                  }
                })
                .then((data) => {
                  if (data.hasOwnProperty("username")) {
                    setError("Sorry, that username is already taken");
                  } else if (data.hasOwnProperty("email")) {
                    setError("Sorry, that email address is already taken");
                  } else {
                    setError("Sorry, unable to register");
                  }
                });
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <FormikForm>
              <Form.Group className='mb-3' controlId='formBasicUsername'>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  name='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Username'
                  type='username'
                  value={values.username}
                />
                <ErrorMessage
                  className='text-danger'
                  name='username'
                  component='div'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name='email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Email address'
                  type='email'
                  value={values.email}
                />
                <ErrorMessage
                  className='text-danger'
                  name='email'
                  component='div'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name='password'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Password'
                  type='password'
                  value={values.password}
                />
                <ErrorMessage
                  className='text-danger'
                  name='password'
                  component='div'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formBasicConfirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  name='confirmation'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder='Confirm password'
                  type='password'
                  value={values.confirmation}
                />
                <ErrorMessage
                  className='text-danger'
                  name='confirmation'
                  component='div'
                />
              </Form.Group>

              <label>
                <Field type='checkbox' name='receive_emails_order_updates' />
                Email me about the status of my orders
              </label>

              <p />

              <label>
                <Field type='checkbox' name='receive_emails_new_rugs' />
                Email me when new rugs are available to buy
              </label>

              <p />

              <Button disabled={isSubmitting} variant='success' type='submit'>
                Register
              </Button>
            </FormikForm>
          )}
        </Formik>
        <div className='text-danger'>{error}</div>
        Already have an account?{" "}
        <Link to={`/login?next=${searchParams.get("next") || "/"}`}>Login</Link>
      </div>
    </div>
  );
}

export default withCookies(RegisterPage);
