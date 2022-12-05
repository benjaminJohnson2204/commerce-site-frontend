import { useEffect, useState } from 'react';
import { Col, Container, Row, Image, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Rug } from '../components/RugComponent';
import SiteHeader from '../components/SiteHeader';
import axiosService, { getDayMonthYear, getTime } from '../utils';

export interface Order {
  id: number;
  date_placed: string;
  date_ready: string;
  date_completed: string;
  rugs: number[];
  price: number;
  status: string;
}

export default function OrderPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [order, setOrder] = useState<Order>();
  const [rugs, setRugs] = useState<Rug[]>();

  useEffect(() => {
    axiosService
      .get(`/api/order/${id}`)
      .then((res) => {
        setOrder(res.data['order']);
        setRugs(res.data['rugs']);
      })
      .catch((err) => {
        navigate('/profile');
      });
  }, []);

  const goToRugPage = (id: number) => {
    navigate(`/rug/${id}`);
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Order #{id}</h1>
        {order && rugs ? (
          <Container>
            <p>
              {order.status === 'pe'
                ? 'Pending'
                : order.status === 'co'
                ? 'Complete'
                : 'Ready for pickup'}
            </p>
            <p>{`Placed on ${getDayMonthYear(order.date_placed)} at ${getTime(
              order.date_placed
            )}`}</p>
            <p>${order.price}</p>
            <p>{rugs.length + (rugs.length > 1 ? ' rugs:' : ' rug:')}</p>
            {rugs.map((rug) => (
              <Row>
                <Col xs={12} md={6} lg={4}>
                  <Image
                    onClick={() => goToRugPage(rug.id)}
                    style={{ cursor: 'pointer' }}
                    src={rug.image_url}
                    width='100%'
                    height='auto'
                  />
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Card.Text as='a' onClick={() => goToRugPage(rug.id)}>
                    {rug.title}
                  </Card.Text>
                  <p>{rug.description}</p>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <p>{`$${rug.price}`}</p>
                </Col>
              </Row>
            ))}
          </Container>
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  );
}
