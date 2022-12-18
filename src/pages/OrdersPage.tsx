import { useEffect, useRef, useState } from 'react';
import { Button, Form, Overlay, Pagination, Row, Table } from 'react-bootstrap';
import { ArrowDown, ArrowUp } from 'react-bootstrap-icons';
import { Cookies, withCookies } from 'react-cookie';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import axiosService, { getDayMonthYear, getTime } from '../utils';
import { Order } from './OrderPage';

interface OrderListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Order[];
}

function ProfilePage(props: { cookies: Cookies }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [filtersShown, setFiltersShown] = useState(true);
  const [statusFiltersOpen, setStatusFiltersOpen] = useState(false);
  const statusFiltersTarget = useRef(null);
  const [ordersResponse, setOrdersResponse] = useState<OrderListResponse>();
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axiosService
      .get(
        `/api/order?page=${page}${
          searchParams.get('ordering')
            ? '&ordering=' + searchParams.get('ordering')
            : ''
        }${
          searchParams.get('status')
            ? '&status=' + searchParams.get('status')
            : ''
        }`
      )
      .then((res) => setOrdersResponse(res.data));
  }, [location, page]);

  const goToOrderPage = (id: number) => {
    navigate(`/order/${id}`);
  };

  const clearFilters = () => {
    navigate('/orders');
  };

  const addStatusFilter = (e: any) => {
    if (e.target.checked) {
      if (searchParams.get('status')) {
        searchParams.set(
          'status',
          searchParams.get('status') + ',' + e.target.value
        );
      } else {
        searchParams.set('status', e.target.value);
      }
    } else {
      if (searchParams.get('status')?.includes(',')) {
        searchParams.set(
          'status',
          searchParams.get('status')!.replace(e.target.value, '')
        );
      } else {
        searchParams.delete('status');
      }
    }
    setSearchParams(searchParams);
  };

  const renderOrderingButtons = (fieldName: string) => {
    if (!filtersShown) return;
    const isOrderedFieldAscending = searchParams.get('ordering') === fieldName;
    const isOrderedFieldDescending =
      searchParams.get('ordering') === '-' + fieldName;

    return (
      <Row className='gap-3 mx-3'>
        <Button
          variant={isOrderedFieldAscending ? 'success' : 'transparent'}
          style={{ borderRadius: 25 }}
          onClick={() => {
            if (isOrderedFieldAscending) {
              searchParams.delete('ordering');
            } else {
              searchParams.set('ordering', fieldName);
            }
            setSearchParams(searchParams);
          }}
        >
          <ArrowUp />
        </Button>
        <Button
          variant={isOrderedFieldDescending ? 'success' : 'transparent'}
          style={{ borderRadius: 25 }}
          onClick={() => {
            if (isOrderedFieldDescending) {
              searchParams.delete('ordering');
            } else {
              searchParams.set('ordering', '-' + fieldName);
            }
            setSearchParams(searchParams);
          }}
        >
          <ArrowDown />
        </Button>
      </Row>
    );
  };

  const renderPaginationItems = () => {
    if (!ordersResponse) return;
    const items = [];
    for (
      let i = 0;
      i < Math.ceil(ordersResponse.count / ordersResponse?.results.length);
      i++
    ) {
      items.push(
        <Pagination.Item
          key={i}
          active={page === i}
          onChange={() => setPage(i)}
        >
          {i + 1}
        </Pagination.Item>
      );
    }
    return items;
  };

  return (
    <div>
      <SiteHeader isAuthenticated={true} />
      <div className='page'>
        <h1 className='m-3'>Your Orders</h1>
        <Row style={{ gap: 20 }}>
          <Button
            variant={filtersShown ? 'variant' : 'success'}
            onClick={() => setFiltersShown(!filtersShown)}
          >
            {filtersShown ? 'Hide filters' : 'Show filters'}
          </Button>
          <Button variant='danger' onClick={clearFilters}>
            Clear filters
          </Button>
        </Row>
        {ordersResponse?.results ? (
          <>
            <Table className='m-3' style={{ maxWidth: 1200 }}>
              <thead>
                <tr>
                  <th>
                    <Row className='gap-2 justify-content-center align-items-center'>
                      <strong>Number of rugs</strong>
                      {renderOrderingButtons('rug_count')}
                    </Row>
                  </th>
                  <th>
                    <Row className='gap-2 justify-content-center align-items-center'>
                      <strong>Total price</strong>
                      {renderOrderingButtons('price')}
                    </Row>
                  </th>
                  <th>
                    <Row className='gap-2 justify-content-center align-items-center'>
                      <strong>Date placed</strong>
                      {renderOrderingButtons('date_placed')}
                    </Row>
                  </th>
                  <th>
                    <Row className='gap-2 justify-content-center align-items-center'>
                      <strong>Status</strong>
                      {renderOrderingButtons('status')}
                      <Button
                        variant='success'
                        ref={statusFiltersTarget}
                        onClick={() => setStatusFiltersOpen(!statusFiltersOpen)}
                      >
                        Filter
                      </Button>
                      <Overlay
                        target={statusFiltersTarget.current}
                        show={statusFiltersOpen}
                        placement='right'
                      >
                        {({
                          placement,
                          arrowProps,
                          show: _show,
                          popper,
                          ...props
                        }) => (
                          <div
                            {...props}
                            style={{
                              position: 'absolute',
                              padding: '2px 10px',
                              borderRadius: 3,
                              ...props.style,
                            }}
                          >
                            <Form.Check
                              type='checkbox'
                              label='Pending'
                              value='pe'
                              checked={searchParams
                                .get('status')
                                ?.includes('pe')}
                              onChange={addStatusFilter}
                            />
                            <Form.Check
                              type='checkbox'
                              label='Ready'
                              value='re'
                              checked={searchParams
                                .get('status')
                                ?.includes('re')}
                              onChange={addStatusFilter}
                            />
                            <Form.Check
                              type='checkbox'
                              label='Complete'
                              value='co'
                              checked={searchParams
                                .get('status')
                                ?.includes('co')}
                              onChange={addStatusFilter}
                            />
                          </div>
                        )}
                      </Overlay>
                    </Row>
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordersResponse?.results.map((order) => (
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
            <Pagination>
              <>
                <Pagination.First
                  disabled={
                    ordersResponse?.previous === null &&
                    ordersResponse?.next === null
                  }
                  onChange={() => setPage(1)}
                />
                <Pagination.Prev
                  disabled={ordersResponse?.previous === null}
                  onChange={() => setPage(page - 1)}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  disabled={ordersResponse?.next === null}
                  onChange={() => setPage(page + 1)}
                />
                <Pagination.Last
                  disabled={
                    ordersResponse?.previous === null &&
                    ordersResponse?.next === null
                  }
                  onChange={() =>
                    setPage(
                      Math.ceil(
                        ordersResponse.count / ordersResponse.results.length
                      )
                    )
                  }
                />
              </>
            </Pagination>
          </>
        ) : (
          'Loading...'
        )}
        {ordersResponse?.results.length === 0 &&
          (searchParams.get('status') || searchParams.get('ordering') ? (
            <Row className='align-items-center'>
              <h4>No results</h4>
              <Button className='mx-3' onClick={clearFilters}>
                Clear filters
              </Button>
            </Row>
          ) : (
            <h4>You haven't made any orders yet</h4>
          ))}
      </div>
    </div>
  );
}

export default withCookies(ProfilePage);
