import "bootstrap/dist/css/bootstrap.css";
import App from "next/app";

import "styles/globals.css";
import api from "api";
import Header from "components/header";

function CustomApp({ Component, pageProps, currentUser }) {
  return (
    <>
      <Header currentUser={currentUser} />

      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </>
  );
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
