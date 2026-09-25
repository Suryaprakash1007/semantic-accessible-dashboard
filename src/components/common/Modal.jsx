import { useRef } from "react";

function Modal({ title, children, triggerLabel }) {
  const dialogRef = useRef(null);

  function openModal() {
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button type="button" onClick={openModal}>
        {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="modal-title"
        className="accessible-modal"
      >
        <div className="modal-content">
          <h2 id="modal-title">{title}</h2>

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