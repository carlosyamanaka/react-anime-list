import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Pages from "./jikan/Pages";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./jikan/ErrorPage";
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
