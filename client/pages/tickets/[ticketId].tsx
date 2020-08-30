import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import useRequest from "hooks/use-request";

function TicketsDetailPage() {
  const router = useRouter();
  const { ticketId } = router.query;

  const [info, setInfo] = useState({});
  const { title, price } = info;

  const { doRequest } = useRequest({
    url: `/tickets/${ticketId}`,
    method: "get",
    onSuccess: (data = {}) => {
      setInfo(data);
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <>
      <h1>Ticket Details</h1>

      <h3>{title}</h3>

      <p>{price}</p>

      <button className="btn btn-primary">Purchase</button>
    </>
  );
}

export default TicketsDetailPage;
