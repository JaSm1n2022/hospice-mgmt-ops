import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import createSagaMiddleware from "redux-saga";

import logger from "redux-logger";
import { rootSaga } from "./store/sagas/rootSaga";
import reducers from "./store/reducers";
// import { createRoot } from 'react-dom/client';

import registerServiceWorker from "./registerServiceWorker";
import App from "./App";

const composeEnhancers =
  (process.env.NODE_ENV === "development"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : null) || compose;

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(sagaMiddleware, logger))
);

sagaMiddleware.run(rootSaga);

const IntlContext = React.createContext();
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <IntlContext.Provider>
        <App />
      </IntlContext.Provider>
    </BrowserRouter>
  </Provider>
);

// const container =  (app,document.getElementById('root'));
// const root = createRoot(container);
// root.render(root)

const root = document.getElementById("root");
if (root) {
  // Set up the browser history with the updated location (minus the # sign)
  const path = (/#!(\/.*)$/.exec(window.location.hash) || [])[1];
  if (path) {
    // window.location.replace(path);
  }

  ReactDOM.render(app, root);
  registerServiceWorker();
}
