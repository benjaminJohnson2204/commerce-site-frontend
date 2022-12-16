import { Field, Formik, Form, FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Cookies, withCookies } from 'react-cookie';
import SiteHeader from '../components/SiteHeader';
import axiosService, { getDayMonthYear, getTime } from '../utils';

const EmailPreferencesPage = () => {
  const [emailsNewRugs, setEmailsNewRugs] = useState(false);
  const [preferenceUpdates, setPreferenceUpdates] = useState(0);

  useEffect(() => {
    axiosService
      .get(`/api/authenticated`)
      .then((res) => setEmailsNewRugs(res.data['receive_emails_new_rugs']));
  }, [preferenceUpdates]);

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
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
                axiosService.patch(`/api/user`, values).then((res) => {
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
};

export default withCookies(EmailPreferencesPage);
