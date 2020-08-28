import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function SignupPage() {
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const [errors, setErrors] = useState([]);

  const onSubmit = async (values) => {
    try {
      setErrors([]);
      const { data } = await axios.post("/api/users/signup", values);

      reset();
    } catch (error) {
      setErrors(error.response.data.errors);
    }
  };

  const renderErrors = () => {
    if (!errors.length) return;

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
      <h1>Sign Up</h1>

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

      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
}

export default SignupPage;
