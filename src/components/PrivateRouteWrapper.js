import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteWrapper = () => {
    const auth = JSON.parse(localStorage.getItem('authToken'));

    if (!auth?.user?.userId) {
        return <Navigate to="/" />;
    }

    return <Outlet />
};

export default PrivateRouteWrapper;
