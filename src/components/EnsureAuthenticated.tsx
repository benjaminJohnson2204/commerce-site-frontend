import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosService from '../utils';

export default function EnsureAuthenticated(props: { page: JSX.Element }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axiosService.get(`/api/authenticated`).catch((err) => {
      navigate(`/login?next=${location.pathname}`);
    });
  }, []);

  return props.page;
}
