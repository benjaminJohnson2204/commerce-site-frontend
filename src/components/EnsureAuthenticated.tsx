import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function EnsureAuthenticated(props: { page: JSX.Element }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch("/api/authenticated").then((res: Response) => {
      if (!res.ok) {
        navigate(`/login?next=${location.pathname}`);
      }
    });
  }, []);

  return props.page;
}
