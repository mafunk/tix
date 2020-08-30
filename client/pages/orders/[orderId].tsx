import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StripeCheckout from "react-stripe-checkout";

import useRequest from "hooks/use-request";

function OrderDetailPage() {
  const router = useRouter();
  const { orderId } = router.query;

  const [info, setInfo] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const { expiresAt = 0, status, ticket = {} } = info;
  const { title, price } = ticket;

  const isExpired = timeLeft <= 0;

  const { doRequest: fetchOrder } = useRequest({
    url: `/orders/${orderId}`,
    method: "get",
    onSuccess: (data = {}) => {
      setInfo(data);
    },
  });

  const { doRequest: createPayment } = useRequest({
    url: `/payments`,
    method: "post",
    onSuccess: (data = {}) => {
      //setInfo(data);

      console.log("pymt created", data);
      router.push("/orders");
    },
  });

  useEffect(() => {
    fetchOrder();

    const findTimeLeft = () => {
      const msLeft = new Date(expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    const interval = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [orderId]);

  const handleToken = (info) => {
    console.log("stripe", info, orderId, !isExpired);
    if (!isExpired) createPayment({ token: info.id, orderId });
  };

  return (
    <>
      <h1>Order Details</h1>

      {!isExpired && <h3>Reserved for {timeLeft} seconds</h3>}

      <p>
        Ticket: {title} - ${price}
      </p>

      {!!price && (
        <StripeCheckout
          stripeKey="pk_test_51HLgRAEXeAAq8FwH664OJQHJYjEtey4z6QNBm2uv6CDU1Kll7RZHZcCU5RirFeSZ6NL46dqAQurOsnH2SkMNmgS300B28moTbe"
          token={handleToken}
        />
      )}

      {/* 
      <button
        className="btn btn-primary"
        onClick={handleClick}
        disabled={isExpired}
      >
        Pay
      </button> */}
    </>
  );
}

export default OrderDetailPage;
