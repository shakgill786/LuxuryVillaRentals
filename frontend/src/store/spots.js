import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const UPDATE_SPOT = 'spots/UPDATE_SPOT';
const LOAD_REVIEWS = 'spots/LOAD_REVIEWS';
const ADD_REVIEW = 'spots/ADD_REVIEW';
const FETCH_ERROR = 'spots/FETCH_ERROR';

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

const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const fetchError = (error) => ({
  type: FETCH_ERROR,
  error,
});

// Thunk Actions
export const fetchAllSpots = (page = 1, size = 20) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots?page=${page}&size=${size}`);
    if (response.ok) {
      const spots = await response.json();
      dispatch(loadSpots(spots, page, size));
    }
  } catch (err) {
    console.error('Fetch Spots Error:', err);
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
    console.error('Fetch Spot Details Error:', err);
    dispatch(fetchError(err));
  }
};

export const createSpotThunk = (spotData) => async (dispatch) => {
  console.log("🚀 Dispatching createSpotThunk with:", spotData);

  try {
      const response = await csrfFetch('/api/spots', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(spotData),
      });

      console.log("📡 Response from API:", response);

      if (response.ok) {
          const newSpot = await response.json();
          console.log("✅ Successfully created spot:", newSpot);
          dispatch(createSpot(newSpot));
          return newSpot;
      } else {
          const error = await response.json();
          console.error("❌ API Error Response:", error);
          throw error;
      }
  } catch (err) {
      console.error("🚨 Create Spot Error:", err);
      throw err;
  }
};

export const updateSpotThunk = (spotId, updatedSpotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSpotData),
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(updateSpot(updatedSpot));
      return updatedSpot;
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (err) {
    console.error('Update Spot Error:', err);
    throw err;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteSpotAction(spotId));
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (err) {
    console.error('Delete Spot Error:', err);
    throw err;
  }
};

// ✅ Fetch reviews for a spot
export const fetchReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const reviews = await response.json();
      dispatch(loadReviews(reviews.Reviews)); // Ensure we're only passing the reviews array
    }
  } catch (err) {
    console.error('Fetch Reviews Error:', err);
    dispatch(fetchError(err));
  }
};

// ✅ Post a new review for a spot
export const postReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });

    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview));
      dispatch(fetchReviews(spotId)); // Refresh reviews after posting
      return newReview;
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (err) {
    console.error('Post Review Error:', err);
    throw err;
  }
};

// Initial State
const initialState = {
  allSpots: {},
  pagination: { page: 1, size: 20 },
  singleSpot: null,
  spotReviews: {}, // ✅ Added spot reviews state
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
      newState.pagination = { page: action.page, size: action.size };
      return newState;
    }

    case LOAD_SINGLE_SPOT:
      return { ...state, singleSpot: action.spot };

    case CREATE_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.spot.id]: action.spot,
        },
      };

    case DELETE_SPOT: {
      const newState = { ...state, allSpots: { ...state.allSpots } };
      delete newState.allSpots[action.spotId];
      return newState;
    }

    case UPDATE_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
      };

    case LOAD_REVIEWS: {
      return {
        ...state,
        spotReviews: action.reviews.reduce((acc, review) => {
          acc[review.id] = review;
          return acc;
        }, {}),
      };
    }

    case ADD_REVIEW:
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.review.id]: action.review,
        },
      };

    case FETCH_ERROR:
      return { ...state, error: action.error };

    default:
      return state;
  }
};

export default spotsReducer;