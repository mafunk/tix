import "bootstrap/dist/css/bootstrap.css";
import App from "next/app";

import "styles/globals.css";
import api from "api";
import Header from "components/header";

function CustomApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />

      <Component {...pageProps} currentUser={currentUser} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  console.log("_app", ctx);
  const { req } = ctx;

  const { data } = await api.get("/users/current", { headers: req.headers });

  return {
    props: { ...data }, // will be passed to the page component as props
  };
}

CustomApp.getInitialProps = async (appCtx) => {
  const appProps = await App.getInitialProps(appCtx);

  const { ctx, Component } = appCtx;
  const { req } = ctx;
  const { getInitialProps } = Component;

  const { data } = await api.get("/users/current", { headers: req?.headers });
  const pageProps = getInitialProps ? await getInitialProps(ctx) : {};

  return { pageProps, ...data };
};

export default CustomApp;
