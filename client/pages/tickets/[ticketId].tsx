import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import useRequest from "hooks/use-request";

function TicketDetailPage() {
  const router = useRouter();
  const { ticketId } = router.query;

  const [info, setInfo] = useState({});
  const { title, price, orderId } = info;

  const { doRequest: fetchTicket } = useRequest({
    url: `/tickets/${ticketId}`,
    method: "get",
    onSuccess: (data = {}) => {
      setInfo(data);
    },
  });

  const { doRequest: createOrder } = useRequest({
    url: `/orders`,
    method: "post",
    onSuccess: (data = {}) => {
      //setInfo(data);

      //console.log("order created", data);

      router.push("/orders/[orderId]", `/orders/${data.id}`);
    },
  });

  useEffect(() => {
    fetchTicket();
  }, []);

  const handleClick = () => {
    createOrder({ ticketId });
  };

  return (
    <>
      <h1>Ticket Details</h1>

      <h3>{title}</h3>

      <p>{price}</p>

      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={!!orderId}
      >
        Add To Cart
      </button>
    </>
  );
}

export default TicketDetailPage;
