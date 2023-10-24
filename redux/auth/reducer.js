import actions from './actions';

const initialState = {
  isAuthenticated: false,
  loginLoader: false,

  user: null,
  userLoader: true,

  logoutLoader: false,

  forgotPasswordLoader: false,

  resetPasswordLoader: false,
  isResetPasswordSucceed: false,
};

function Reducer(state = initialState, action) {
  switch (action.type) {
    case actions.UNAUTHORIZED:
      return { ...state, isAuthenticated: false };

    case actions.GET_AUTH_USER:
      return { ...state, userLoader: true };
    case actions.GET_AUTH_USER_SUCCESS:
      return {
        ...state,
        userLoader: false,
        isAuthenticated: !!action.payload.data.user,
        user: action.payload.data.user,
      };
    case actions.GET_AUTH_USER_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        userLoader: false,
        user: null,
      };

    case actions.LOGIN:
      return {
        ...state,
        loginLoader: true,
      };
    case actions.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: !!action.payload.data.user,
        loginLoader: false,
        user: action.payload.data.user,
      };
    case actions.LOGIN_FAILURE:
      return { ...state, isAuthenticated: false, loginLoader: false };

    case actions.LOGOUT:
      return { ...state, logoutLoader: true };
    case actions.LOGOUT_SUCCESS:
      return { ...state, isAuthenticated: false, logoutLoader: false };
    case actions.LOGOUT_FAILURE:
      return { ...state, isAuthenticated: false, logoutLoader: false };

    case actions.FORGOT_PASSWORD:
      return {
        ...state,
        forgotPasswordLoader: true,
      };
    case actions.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotPasswordLoader: false,
      };
    case actions.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        forgotPasswordLoader: false,
      };

    case actions.RESET_PASSWORD:
      return {
        ...state,
        resetPasswordLoader: true,
        isResetPasswordSucceed: false,
      };
    case actions.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordLoader: false,
        isResetPasswordSucceed: true,
      };
    case actions.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        resetPasswordLoader: false,
        isResetPasswordSucceed: false,
      };

    case actions.NEW_NOTIFICATION:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: [
            { ...action.payload, read_at: null },
            ...state.user.notifications,
          ],
        },
      };

    case actions.READ_NOTIFICATION:
      return { ...state };
    case actions.READ_NOTIFICATION_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          notifications: action.payload.data,
        },
      };
    case actions.READ_NOTIFICATION_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
}

export default Reducer;
