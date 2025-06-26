import React from "react";
import Error from "../../components/Error";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";

function ErrorPage() {
  return (
    <>
      <div className="content-container">
        <Header />
        <div className="container">
          <Navbar />
          <Error />
        </div>
      </div>
    </>
  );
}

export default ErrorPage;
