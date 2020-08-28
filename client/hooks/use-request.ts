import { useState } from "react";
import api from "api";

function useRequest(props) {
  const { url, method, onSuccess } = props;

  const [errors, setErrors] = useState([]);

  const doRequest = async (body = {}) => {
    setErrors(null);

    try {
      setErrors([]);
      const { data } = await api[method](url, body);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  return { errors, doRequest };
}

export default useRequest;
