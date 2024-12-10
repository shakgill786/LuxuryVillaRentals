import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const FETCH_ERROR = 'spots/FETCH_ERROR';
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT";
const LOAD_REVIEWS = "spots/LOAD_REVIEWS";
const ADD_REVIEW = "spots/ADD_REVIEW";

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

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
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
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    if (response.ok) {
      const spotDetails = await response.json();
      dispatch(loadSingleSpot(spotDetails));
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    dispatch(fetchError(err));
  }
};

export const fetchReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const reviews = await response.json();
      dispatch(loadReviews(reviews));
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    dispatch(fetchError(err));
  }
};

export const postReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      return newReview;
    }
  } catch (err) {
    console.error('Post Review Error:', err);
    dispatch(fetchError(err));
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

    case FETCH_ERROR:
      return { ...state, error: action.error };

    case LOAD_REVIEWS:
      return {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          Reviews: action.reviews,
        },
      };

    case ADD_REVIEW:
      return {
        ...state,
        singleSpot: {
          ...state.singleSpot,
          Reviews: [action.review, ...state.singleSpot.Reviews],
        },
      };

    default:
      return state;
  }
};

export default spotsReducer;