import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";

function LayoutRoute() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutRoute;
