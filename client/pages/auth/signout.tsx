import { useEffect } from "react";
import { useRouter } from "next/router";

import useRequest from "hooks/use-request";

function SignOutPage() {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/users/signout",
    method: "post",
    onSuccess: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return null;
}

export default SignOutPage;
