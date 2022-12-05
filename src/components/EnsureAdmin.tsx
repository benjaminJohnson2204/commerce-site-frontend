import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EnsureAdmin(props: { page: JSX.Element }) {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/admin").then((res: Response) => {
      if (!res.ok) {
        navigate("/");
      }
    });
  }, []);

  return props.page;
}
