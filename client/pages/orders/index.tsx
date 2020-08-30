import { useState, useEffect } from "react";
import Link from "next/link";

import useRequest from "hooks/use-request";

function OrdersListPage(props) {
  const { currentUser } = props;

  const [orders, setOrders] = useState([]);

  const { doRequest } = useRequest({
    url: "/orders",
    method: "get",
    onSuccess: (data = []) => {
      setOrders(data);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  const renderTickets = () => {
    if (!orders.length) return;

    return orders.map((ticket) => {
      const { id, status, ticket: { title, price } = {} } = ticket;
      return (
        <tr key={id}>
          <td>
            <Link href="/orders/[orderId]" as={`/orders/${id}`}>
              <a>{title}</a>
            </Link>
          </td>
          <td>{price}</td>
          <td>{status}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>{renderTickets()}</tbody>
      </table>
    </>
  );
}

export default OrdersListPage;
