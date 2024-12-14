import { useState } from "react";
import CreateReviewModal from "./CreateReviewModal";

const CreateReviewButton = ({ spotId }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        className="create-review-button"
        onClick={() => setShowModal(true)}
      >
        Post Your Review
      </button>
      {showModal && (
        <CreateReviewModal
          spotId={spotId}
          closeModal={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CreateReviewButton;