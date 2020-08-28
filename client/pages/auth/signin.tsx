import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import useRequest from "hooks/use-request";

function SigninPage() {
  const router = useRouter();

  const { handleSubmit, register, reset } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const { doRequest, errors } = useRequest({
    url: "/users/signin",
    method: "post",
    onSuccess: () => {
      reset();
      router.push("/");
    },
  });

  const onSubmit = (values) => {
    doRequest(values);
  };

  const renderErrors = () => {
    if (!errors?.length) return;

    const errorList = errors.map((err) => {
      const { message } = err;

      return <li key={message}>{message}</li>;
    });

    return (
      <div className="alert alert-danger">
        <h4>Ooops...</h4>

        <ul className="my-0">{errorList}</ul>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign In</h1>

      <div className="form-group">
        <label>Email Address</label>

        <input
          className="form-control"
          type="email"
          name="email"
          ref={register}
        />
      </div>

      <div className="form-group">
        <label>Password</label>

        <input
          className="form-control"
          type="password"
          name="password"
          ref={register}
        />
      </div>

      {renderErrors()}

      <button className="btn btn-primary">Sign In</button>
    </form>
  );
}

export default SigninPage;
