import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosService from '../utils';

export default function EnsureAdmin(props: { page: JSX.Element }) {
  const navigate = useNavigate();

  useEffect(() => {
    axiosService.get(`/api/admin`).catch((err) => {
      navigate('/');
    });
  }, []);

  return props.page;
}
