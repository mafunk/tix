import { useState, useEffect } from "react";
import Link from "next/link";

import useRequest from "hooks/use-request";

function TicketsListPage() {
  const [tickets, setTickets] = useState([]);

  const { doRequest } = useRequest({
    url: "/tickets",
    method: "get",
    onSuccess: (data = []) => {
      setTickets(data);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  const renderTickets = () => {
    if (!tickets.length) return;

    return tickets.map((ticket) => {
      const { id, title, price } = ticket;
      return (
        <tr key={title}>
          <td>
            <Link href="/tickets/[ticketId]" as={`/tickets/${id}`}>
              <a>{title}</a>
            </Link>
          </td>
          <td>{price}</td>
          <td>Purchase</td>
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
            <th></th>
          </tr>
        </thead>

        <tbody>{renderTickets()}</tbody>
      </table>
    </>
  );
}

export default TicketsListPage;
