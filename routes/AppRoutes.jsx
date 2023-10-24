import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import CustomerRoutes from './CustomerRoutes';
import AdminRoutes from './AdminRoutes';

const Login = lazy(() => import('../components/auth/Login'));
const PetOwner = lazy(() => import('../components/pages/PetOwner'));
const ForgotPassword = lazy(() => import('../components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../components/auth/ResetPassword'));
const PageNotFound = lazy(() => import('../components/auth/PageNotFound'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="reset-password/:email/:token"
              element={<ResetPassword />}
            />
          </Route>
          <Route path="/pet-owner/:token" element={<PetOwner />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/*" element={<CustomerRoutes />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
