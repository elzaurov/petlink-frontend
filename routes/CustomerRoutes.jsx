import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  LINK_CUSTOMER_CASE_LIST,
  LINK_CUSTOMER_NEW_CASE,
  LINK_LOGIN,
} from '../constants/links';

const routesMap = {
  [LINK_CUSTOMER_CASE_LIST]: lazy(() => import('../components/pages/CaseList')),
  [LINK_CUSTOMER_NEW_CASE]: lazy(() => import('../components/pages/NewCase')),
  ['/case/:id']: lazy(() => import('../components/pages/CaseDetail')),
  ['/case/:id/edit']: lazy(() => import('../components/pages/NewCase')),
  ['/case/:id/note']: lazy(() => import('../components/pages/CaseNote')),
  ['/case/:id/refusal']: lazy(() =>
    import('../components/pages/widgets/Refusal')
  ),
  ['/case/:id/dekningstilsagn']: lazy(() =>
    import('../components/pages/Dekningstilsagn')
  ),
  ['/settings']: lazy(() => import('../components/pages/Settings')),
};

export default function CustomerRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || user.isAdmin) {
    return <Navigate to={LINK_LOGIN} />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to={LINK_CUSTOMER_CASE_LIST} />} />
      {Object.entries(routesMap).map(([path, Component]) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}
