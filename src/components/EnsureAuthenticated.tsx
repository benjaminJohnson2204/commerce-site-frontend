import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import authSlice from '../store/slices/auth';
import axiosService from '../utils';

export default function EnsureAuthenticated(props: { page: JSX.Element }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    axiosService.get(`/api/authenticated`).catch((err) => {
      dispatch(authSlice.actions.setAuthToken(null));
      navigate(`/login?next=${location.pathname}`);
    });
  }, []);

  return props.page;
}
