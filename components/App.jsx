import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { Provider, useDispatch, useSelector } from 'react-redux';
import actions from '../redux/auth/actions';
import store from '../redux/store';

import AppRoutes from '../routes/AppRoutes';
import Loader from './ui/Loader';
import { ConfigProvider } from 'antd';
import nb_NO from 'antd/lib/locale/nb_NO';

export default function App() {
  const { isAuthenticated, userLoader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch({ type: actions.GET_AUTH_USER });
    }
  }, []);

  if (userLoader) {
    return <Loader />;
  }
  return <AppRoutes />;
}

if (document.getElementById('root')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#0293d9',
            colorLink: '#0293d9',
            borderRadius: 0,
            borderRadiusLG: 0,
            colorBgLayout: '#f3f8fb',
            colorBgContainer: '#fff',
            fontSize: 14,
            fontFamily: 'Petlink',
            colorBorder: '#ccced1',
            colorSplit: '#ccced1',
            colorBorderSecondary: '#ccced1',
            colorBorderBg: '#ccced1',
          },
        }}
        locale={nb_NO}
      >
        <App />
      </ConfigProvider>
    </Provider>
  );
}
