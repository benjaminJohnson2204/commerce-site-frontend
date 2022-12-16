import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Cookies, withCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import axiosService, { getDayMonthYear, getTime } from '../utils';
import { Order } from './OrderPage';

function ProfilePage(props: { cookies: Cookies }) {
  const navigate = useNavigate();

  const [orders, setOrders]: [Order[], Function] = useState([]);

  useEffect(() => {
    axiosService
      .get(`/api/order`)
      .then((res) => setOrders(res.data['results']));
  }, []);

  const goToOrderPage = (id: number) => {
    navigate(`/order/${id}`);
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Your Orders</h1>
        {orders ? (
          orders.length > 0 ? (
            <Table className='m-3' style={{ maxWidth: 1200 }}>
              <thead>
                <tr>
                  <th>
                    <strong>Number of rugs</strong>
                  </th>
                  <th>
                    <strong>Total price</strong>
                  </th>
                  <th>
                    <strong>Date placed</strong>
                  </th>
                  <th>
                    <strong>Status</strong>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    onClick={() => goToOrderPage(order.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{order.rugs.length}</td>
                    <td>${order.price}</td>
                    <td>
                      {`${getDayMonthYear(order.date_placed)} at ${getTime(
                        order.date_placed
                      )}`}
                    </td>
                    <td>
                      {order.status === 'pe'
                        ? 'Pending'
                        : order.status === 'co'
                        ? 'Complete'
                        : 'Ready for pickup'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <h2>You haven't made any orders yet</h2>
          )
        ) : (
          'Loading...'
        )}
      </div>
    </div>
  );
}

export default withCookies(ProfilePage);
