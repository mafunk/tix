import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import useRequest from "hooks/use-request";

function NewTicketPage() {
  const router = useRouter();

  const { handleSubmit, register, reset } = useForm({
    defaultValues: { title: "", price: 0 },
  });

  const { doRequest, errors } = useRequest({
    url: "/tickets",
    method: "post",
    onSuccess: () => {
      reset();
      router.push("/tickets");
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
      <h1>Create A Ticket</h1>

      <div className="form-group">
        <label>Title</label>

        <input
          className="form-control"
          type="text"
          name="title"
          ref={register}
        />
      </div>

      <div className="form-group">
        <label>Price</label>

        <input
          className="form-control"
          type="number"
          name="price"
          ref={register}
        />
      </div>

      {renderErrors()}

      <button className="btn btn-primary">Create</button>
    </form>
  );
}

export default NewTicketPage;
