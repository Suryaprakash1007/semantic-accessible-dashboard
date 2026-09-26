
import { useEffect, useId, useRef } from "react";

function Modal({
  title,
  children,
  triggerLabel,
  open,
  onClose,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  // Support opening the dialog from a parent component
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open === true && !dialog.open) {
      dialog.showModal();
    } else if (open === false && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function handleClose() {
    onClose?.();
  }

  return (
    <>
      {triggerLabel && (
        <button type="button" onClick={openModal}>
          {triggerLabel}
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="accessible-modal"
        onClose={handleClose}
      >
        <div className="modal-content">
          <h2 id={titleId}>{title}</h2>

          {children}

          <button type="button" onClick={closeModal}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}

export default Modal;