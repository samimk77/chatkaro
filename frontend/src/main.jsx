import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import axios from "axios";

// Send JWT cookie on every cross-origin request (Vercel → Render)
axios.defaults.withCredentials = true;

let persiststor = persistStore(store);

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </BrowserRouter>,
);
