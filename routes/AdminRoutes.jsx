import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  LINK_ADMIN_INSURANCE_COMPANY_LIST,
  LINK_ADMIN_INSURANCE_COMPANY_CREATION,
  LINK_ADMIN_VET_LIST,
  LINK_ADMIN_VET_CREATION,
  LINK_ADMIN_TREAT_LIST,
  LINK_LOGIN,
  PREFIX_VET,
  PREFIX_INSURANCE_COMPANY,
} from '../constants/links';

const VetList = lazy(() => import('../components/pages/admin/VetList'));
const VetForm = lazy(() => import('../components/pages/admin/VetForm'));
const InsuranceCompanyList = lazy(() =>
  import('../components/pages/admin/InsuranceCompanyList')
);
const InsuranceCompanyForm = lazy(() =>
  import('../components/pages/admin/InsuranceCompanyForm')
);
const TreatList = lazy(() => import('../components/pages/admin/TreatList'));

// A helper function to remove the "/admin" prefix from the paths
const stripAdminPrefix = (path) =>
  path.startsWith('/admin') ? path.slice('/admin'.length) : path;

const adminRoutes = [
  { path: LINK_ADMIN_VET_LIST, Component: VetList },
  { path: LINK_ADMIN_VET_CREATION, Component: VetForm },
  { path: PREFIX_VET + '/:id/edit', Component: VetForm },
  { path: LINK_ADMIN_INSURANCE_COMPANY_LIST, Component: InsuranceCompanyList },
  {
    path: LINK_ADMIN_INSURANCE_COMPANY_CREATION,
    Component: InsuranceCompanyForm,
  },
  {
    path: PREFIX_INSURANCE_COMPANY + '/:id/edit',
    Component: InsuranceCompanyForm,
  },
  { path: LINK_ADMIN_TREAT_LIST, Component: TreatList },
];

const routesMap = adminRoutes.reduce((routes, { path, Component }) => {
  routes[stripAdminPrefix(path)] = Component;
  return routes;
}, {});

export default function AdminRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user.isAdmin) {
    return <Navigate to={LINK_LOGIN} />;
  }

  return (
    <Routes>
      <Route
        index
        element={<Navigate to={stripAdminPrefix(LINK_ADMIN_VET_LIST)} />}
      />
      {Object.entries(routesMap).map(([path, Component]) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Routes>
  );
}
