// LuxuryVillaServices/frontend/src/store/reviews.js
import { csrfFetch } from "./csrf";

// Action Types
const LOAD_REVIEWS = "reviews/loadReviews";
const ADD_REVIEW = "reviews/addReview";
const UPDATE_REVIEW = "reviews/updateReview";
const DELETE_REVIEW = "reviews/deleteReview";

// Action Creators
const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const updateReviewAction = (review) => ({
  type: UPDATE_REVIEW,
  review,
});

const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

// Thunk Actions
export const fetchReviews = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadReviews(data.Reviews));
    }
  } catch (err) {
    console.error("Failed to fetch reviews:", err);
  }
};

export const addReviewThunk = (spotId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const newReview = await response.json();
    dispatch(addReview(newReview));
    return newReview;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const updateReviewThunk = (reviewId, reviewData) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const updatedReview = await response.json();
    dispatch(updateReviewAction(updatedReview));
    return updatedReview;
  } else {
    const error = await response.json();
    throw error;
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteReviewAction(reviewId));
    }
  } catch (err) {
    console.error("Failed to delete review:", err);
  }
};

// Initial State
const initialState = {
  spotReviews: {},
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
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
          [action.review.id]: action.review,
        },
      };
    }

    case UPDATE_REVIEW: {
      return {
        ...state,
        spotReviews: {
          ...state.spotReviews,
          [action.review.id]: action.review,
        },
      };
    }

    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState.spotReviews[action.reviewId];
      return newState;
    }

    default:
      return state;
  }
};

export default reviewsReducer;
