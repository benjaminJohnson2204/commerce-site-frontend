import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { Cookies, withCookies } from "react-cookie";
import SiteHeader from "../components/SiteHeader";

export interface AddRugValues {
  title: string;
  description: string;
  price: number;
  image_url: string;
}

function AddRugPage(props: { cookies: Cookies }) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Add a new rug</h1>
        {success ? (
          <div className='text-success'>{success}</div>
        ) : error ? (
          <div className='text-success'>{error}</div>
        ) : (
          ""
        )}
        <Formik
          initialValues={{
            title: "",
            description: "",
            price: 0,
            image_url: "",
          }}
          validate={(values: AddRugValues) => {
            const errors: any = {};
            if (!values.title) {
              errors.title = "Title is required";
            } else if (!values.description) {
              errors.description = "Description is required";
            } else if (!values.price) {
              errors.price = "Price is required";
            }
            return errors;
          }}
          onSubmit={(
            values: AddRugValues,
            { setSubmitting }: FormikHelpers<AddRugValues>
          ) => {
            setTimeout(() => {
              fetch("/api/rug", {
                credentials: "include",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "X-CSRFToken": props.cookies.get("csrftoken"),
                },
                body: JSON.stringify(values),
              }).then((res) => {
                if (res.ok) {
                  setSuccess("Rug successfully posted!");
                } else {
                  setError("Error posting rug");
                }
              });
              setSubmitting(false);
            }, 400);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label>
                <p>Rug title</p>
                <Field
                  id='title'
                  type='text'
                  name='title'
                  placeholder='Rug title'
                />
              </label>
              <ErrorMessage
                className='text-danger'
                name='title'
                component='div'
              />
              <p />

              <label>
                <p>Rug description</p>
                <Field
                  id='description'
                  type='text'
                  name='description'
                  placeholder='Rug description'
                />
              </label>
              <ErrorMessage
                className='text-danger'
                name='description'
                component='div'
              />
              <p />

              <label>
                <p>Price ($)</p>
                <Field
                  id='price'
                  type='text'
                  name='price'
                  placeholder='Rug price'
                />
                <ErrorMessage
                  className='text-danger'
                  name='price'
                  component='div'
                />
              </label>
              <p />

              <label>
                <p>URL of rug picture</p>
                <Field
                  id='image_url'
                  type='text'
                  name='image_url'
                  placeholder='URL of image'
                />
                <ErrorMessage
                  className='text-danger'
                  name='image_url'
                  component='div'
                />
              </label>
              <p />

              <Button disabled={isSubmitting} variant='success' type='submit'>
                Add rug
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default withCookies(AddRugPage);
