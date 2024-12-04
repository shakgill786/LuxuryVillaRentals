import { useModal } from '../../context/Modal';

function OpenModalMenuItem({
  modalComponent, // Component to render inside the modal
  itemText, // Text for the menu item
  onItemClick, // Optional: Callback when menu item is clicked
  onModalClose // Optional: Callback when modal closes
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (typeof onItemClick === 'function') onItemClick();
  };

  return <li onClick={onClick}>{itemText}</li>;
}

export default OpenModalMenuItem;