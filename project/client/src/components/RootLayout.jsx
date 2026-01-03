import Header from "./Header";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";

import ScrollToTop from "./ScrollToTop";
import "slick-carousel/slick/slick.css";
import { Provider } from "react-redux";
import { persistor, store } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import MainLoader from "./MainLoader";


const RootLayout = () => {
  const location = useLocation();
  const hideHeaderPaths = ["/signin", "/signup"];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname.toLowerCase());

  return (
    <Provider store={store}>
      <PersistGate loading={<MainLoader />} persistor={persistor}>
        {/* Premium Support Badge */}

        {!shouldHideHeader && <Header />}
        <ScrollRestoration />
        <Outlet />


        <ScrollToTop />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#000000",
              color: "#ffffff",
            },
          }}
        />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
