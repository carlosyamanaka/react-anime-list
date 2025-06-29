import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Pages from "./Pages.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./ErrorPage.jsx";
import { GlobalContextProvider } from "./contexts";

function App() {
  return (
    <>
      <Router>
        <GlobalContextProvider>
          <ErrorBoundary fallback={<ErrorPage />}>
            <Pages />
          </ErrorBoundary>
        </GlobalContextProvider>
      </Router>
    </>
  );
}

export default App;
