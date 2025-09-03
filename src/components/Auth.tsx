import React from "react";
import { Navigate } from "react-router-dom";

export const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  return function WithAuth(props: any) {
    // TODO: replace with real auth check (e.g., from context / localStorage / redux)
    const isAuthenticated = true; // Placeholder for authentication logic

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};