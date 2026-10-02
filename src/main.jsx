import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./store";
import App from "./App";
import "./styles.css";
class Boundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <main className="fatal">
          <h1>Let’s get you back to creating.</h1>
          <p>
            Something interrupted this screen. Your saved campaigns are still in
            your browser.
          </p>
          <button
            className="btn primary"
            onClick={() => {
              window.location.hash = "/dashboard";
              window.location.reload();
            }}
          >
            Back to dashboard
          </button>
          <details>
            <summary>Error details</summary>
            {String(this.state.error)}
          </details>
        </main>
      );
    return this.props.children;
  }
}
const root =
  import.meta.hot?.data.root || createRoot(document.getElementById("root"));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(
  <Boundary>
    <Provider>
      <App />
    </Provider>
  </Boundary>,
);
