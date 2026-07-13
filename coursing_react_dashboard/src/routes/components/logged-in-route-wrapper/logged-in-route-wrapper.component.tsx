/* eslint-disable react/jsx-no-useless-fragment */
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "redux/hooks";
import authSelectors from "redux/slices/auth/auth.selectors";

function LoggedInRouteComponent({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const isLoggedIn = useAppSelector(authSelectors.selectIsLoggedIn);

  return isLoggedIn ? <>{children}</> : <Navigate replace to="/home" />;
}

export default LoggedInRouteComponent;
