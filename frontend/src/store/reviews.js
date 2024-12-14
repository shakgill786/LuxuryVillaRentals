
// Action Types
const DELETE_REVIEW = "reviews/deleteReview";
const LOAD_REVIEWS = "reviews/loadReviews";


// Action Creator
const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
});

const loadReviews = (reviews) => ({
    type: LOAD_REVIEWS,
    reviews,
  });

// Thunk Action
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteReviewAction(reviewId));
  }
};

export const fetchReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(loadReviews(data.Reviews)); // Dispatch the reviews to Redux
    }
  };
  

// Initial State
const initialState = {
    spotReviews: {}, // Reviews for the currently viewed spot
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