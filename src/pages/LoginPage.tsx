import {
  ErrorMessage,
  Formik,
  FormikHelpers,
  Form as FormikForm,
} from "formik";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

interface LoginValues {
  username: string;
  password: string;
}

function LoginPage(props: { cookies: Cookies }) {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
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
        <h1 className='m-3'>Login</h1>
        <Formik
          initialValues={{ username: "", password: "" }}
          validate={(values: LoginValues) => {
            const errors: any = {};
            if (!values.username) {
              errors.username = "Username is required";
            } else if (!values.password) {
              errors.password = "Password is required";
            }
            return errors;
          }}
          onSubmit={(
            values: LoginValues,
            { setSubmitting }: FormikHelpers<LoginValues>
          ) => {
            setTimeout(() => {
              fetch("/api/login", {
                credentials: "include",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": props.cookies.get("csrftoken"),
                },
                body: JSON.stringify(values),
              }).then((res) => {
                if (res.ok) {
                  navigate(searchParams.get("next") || "/");
                } else {
                  setError(true);
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

              <Button disabled={isSubmitting} variant='success' type='submit'>
                Login
              </Button>
            </FormikForm>
          )}
        </Formik>
        {error && (
          <div className='text-danger'>Invalid username and/or password</div>
        )}
        Don't have an account?{" "}
        <Link to={`/register?next=${searchParams.get("next") || "/"}`}>
          Sign up
        </Link>
      </div>
    </div>
  );
}

export default withCookies(LoginPage);
