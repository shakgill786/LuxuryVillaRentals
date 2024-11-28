import { csrfFetch } from './csrf';

// Action Types
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

// Action Creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});


// Thunk Actions
export const restoreUser = () => async (dispatch) => {
  try {
    console.log("Calling restoreUser...");
    const response = await csrfFetch("/api/session");
    console.log("Response received:", response);

    const data = await response.json();
    console.log("Data parsed:", data);

    dispatch(setUser(data.user));
    console.log("Dispatched setUser with:", data.user);

    return response;
  } catch (err) {
    console.error("Error in restoreUser:", err);
    throw err;
  }
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user)); // Add the user to the Redux store
  return response;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  await csrfFetch('/api/session', { method: 'DELETE' });
  dispatch(removeUser());
};

// Initial State
const initialState = { user: null };

// Reducer
const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
};



export default sessionReducer;