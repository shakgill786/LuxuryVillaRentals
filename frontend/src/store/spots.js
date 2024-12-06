import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const FETCH_ERROR = 'spots/FETCH_ERROR';
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT";


// Action Creators
const loadSpots = (spots, page, size) => ({
  type: LOAD_SPOTS,
  spots,
  page,
  size,
});

const loadSingleSpot = (spot) => ({
  type: LOAD_SINGLE_SPOT,
  spot,
});

const fetchError = (error) => ({
  type: FETCH_ERROR,
  error,
});

// Thunk Action to Fetch Spots
export const fetchAllSpots = (page = 1, size = 20) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots?page=${page}&size=${size}`);

    if (response.ok) {
      const spots = await response.json();
      dispatch(loadSpots(spots, page, size));
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    dispatch(fetchError(err));
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spotDetails = await response.json();
    dispatch(loadSingleSpot(spotDetails));
  }
};

// Initial State
const initialState = {
  allSpots: {},
  pagination: {
    page: 1,
    size: 20,
  },
  error: null,
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = { ...state, error: null };
      newState.allSpots = {};
      action.spots.Spots.forEach((spot) => {
        newState.allSpots[spot.id] = spot;
      });
      newState.pagination = {
        page: action.page,
        size: action.size,
      };
      return newState;
    }
      case LOAD_SINGLE_SPOT:
      return { ...state, singleSpot: action.spot };
      case FETCH_ERROR: {
      return { ...state, error: action.error };
    }
    default:
      return state;
  }
};

export default spotsReducer;