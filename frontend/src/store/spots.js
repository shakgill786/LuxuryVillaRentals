import { csrfFetch } from './csrf';

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const FETCH_ERROR = 'spots/FETCH_ERROR';
const LOAD_SINGLE_SPOT = 'spots/LOAD_SINGLE_SPOT';
const LOAD_REVIEWS = 'spots/LOAD_REVIEWS';
const ADD_REVIEW = 'spots/ADD_REVIEW';
const CREATE_SPOT = 'spots/CREATE_SPOT';
const DELETE_SPOT = 'spots/DELETE_SPOT';
const UPDATE_SPOT = "spots/UPDATE_SPOT";



// Action Creators
const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

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

export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

const deleteSpotAction = (spotId) => ({
  type: DELETE_SPOT,
  spotId,
});

// Thunk Actions

export const updateSpotThunk = (spotId, updatedSpotData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedSpotData),
  });

  const updatedSpot = await response.json();
  dispatch(updateSpot(updatedSpot));
  return updatedSpot;
};

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
      dispatch(loadReviews(reviews.Reviews)); // Only pass Reviews array
    }
  } catch (err) {
    console.error('Fetch Error:', err);
    dispatch(fetchError(err));
  }
};

export const postReview = (spotId, reviewData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      const newReview = await response.json();
      dispatch(addReview(newReview)); // Dispatch addReview to update Redux state
      dispatch(fetchSpotDetails(spotId)); // Optional: Refresh spot details (e.g., avg rating)
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


export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch('/api/spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(spotData),
    });

    if (response.ok) {
      const newSpot = await response.json();
      dispatch(createSpot(newSpot));
      return newSpot;
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (err) {
    console.error('Create Spot Error:', err);
    throw err;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      dispatch(deleteSpotAction(spotId)); // Dispatch delete action to update Redux store
    } else {
      const error = await response.json();
      throw error;
    }
  } catch (err) {
    console.error('Delete Spot Error:', err);
    throw err;
  }
};


// Initial State
const initialState = {
  allSpots: {},
  pagination: {
    page: 1,
    size: 20,
  },
  singleSpot: null,
  spotReviews: {}, // Keep reviews for a single spot here
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

    case LOAD_REVIEWS: {
      const newState = { ...state };
      const spotReviews = {};
      action.reviews.forEach((review) => {
        spotReviews[review.id] = review;
      });
      newState.spotReviews = spotReviews;
      return newState;
    }

    case ADD_REVIEW: {
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.review.id]: action.review, // Add new review dynamically
        },
      };
    }

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
      delete newState.allSpots[action.spotId]; // Remove the spot by its ID
      return newState;
    }

    case UPDATE_SPOT: {
      const updatedSpot = action.payload; // Spot data from the action
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [updatedSpot.id]: updatedSpot, // Update the specific spot in allSpots
        },
        singleSpot:
          state.singleSpot && state.singleSpot.id === updatedSpot.id
            ? updatedSpot
            : state.singleSpot, // Update singleSpot only if it's the one being updated
      };
    }

    default:
      return state;
  }
};


export default spotsReducer;