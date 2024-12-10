// Action Types
const DELETE_REVIEW = "reviews/deleteReview";

// Action Creator
const deleteReviewAction = (reviewId) => ({
  type: DELETE_REVIEW,
  reviewId,
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

// Initial State
const initialState = {
  allReviews: {},
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_REVIEW: {
      const newState = { ...state };
      delete newState.allReviews[action.reviewId];
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;