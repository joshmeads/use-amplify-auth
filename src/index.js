import { useReducer, useState, useEffect } from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USER_DATA_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'FETCH_USER_DATA_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        user: action.payload.user,
      };
    case 'FETCH_USER_DATA_FAILURE':
      return { ...state, isLoading: false, isError: true };
    case 'RESET_USER_DATA':
      return { ...state, user: null };
    default:
      throw new Error();
  }
};

const useAmplifyAuth = config => {
  const initialState = {
    isLoading: true,
    isError: false,
    user: null,
  };
  Amplify.configure(config);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [triggerFetch, setTriggerFetch] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (isMounted) {
        dispatch({ type: 'FETCH_USER_DATA_INIT' });
      }
      try {
        if (isMounted) {
          const data = await Auth.currentAuthenticatedUser();
          if (data) {
            dispatch({
              type: 'FETCH_USER_DATA_SUCCESS',
              payload: { user: data },
            });
          }
        }
      } catch (error) {
        if (isMounted) {
          dispatch({ type: 'FETCH_USER_DATA_FAILURE' });
        }
      }
    };

    const onAuthEvent = payload => {
      switch (payload.event) {
        case 'signIn':
          if (isMounted) {
            setTriggerFetch(true);
          }
          break;
        default:
          return;
      }
    };

    const HubListener = () => {
      Hub.listen('auth', data => {
        const { payload } = data;
        onAuthEvent(payload);
      });
    };

    HubListener();
    fetchUserData();

    return () => {
      Hub.remove('auth');
      isMounted = false;
    };
  }, [triggerFetch]);

  const handleSignout = async () => {
    try {
      await Auth.signOut();
      setTriggerFetch(false);
      dispatch({ type: 'RESET_USER_DATA' });
    } catch (error) {
      console.error('Error signing out user ', error);
    }
  };

  return { state, handleSignout };
};

export default useAmplifyAuth;
