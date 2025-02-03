// LuxuryVillaServices/frontend/src/store/session.js

import { csrfFetch } from "./csrf";

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

// ✅ Restore User Session
export const restoreUser = () => async (dispatch) => {
  console.log("🔄 Restoring user session...");
  const response = await csrfFetch("/api/session");

  if (response.ok) {
    const data = await response.json();
    console.log("✅ Restored User:", data.user);
    dispatch(setUser(data.user));
  } else {
    console.error("❌ Failed to restore user session");
  }
  return response;
};

// ✅ Sign Up User
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({ username, firstName, lastName, email, password }),
  });

  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// ✅ Log In User
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({ credential, password }),
  });

  const data = await response.json();
  console.log("✅ User Logged In:", data.user);
  dispatch(setUser(data.user));
  return response;
};

// ✅ Log Out User
export const logout = () => async (dispatch) => {
  await csrfFetch("/api/session", { method: "DELETE" });
  console.log("👤 User Logged Out");
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