import { useModal } from '../../context/Modal';

function OpenModalButton({
  modalComponent, // The component to render inside the modal
  buttonText, // Text of the button
  onButtonClick, // Optional: callback when the button is clicked
  onModalClose, // Optional: callback when the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (typeof onButtonClick === 'function') onButtonClick(); // Trigger button callback
    setModalContent(modalComponent); // Set the modal content
    if (typeof onModalClose === 'function') setOnModalClose(onModalClose); // Set the close callback
  };

  return <button onClick={onClick}>{buttonText}</button>;
}

export default OpenModalButton;