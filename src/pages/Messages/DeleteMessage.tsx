import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';

interface DeleteMessageProps {
  show: boolean;
  onHide: () => void;
  nachricht: string;
}

const DeleteMessage: React.FC<DeleteMessageProps> = ({ show, onHide, nachricht }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [show, onHide]);

  const TrashIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      fill="red"
      className="bi bi-trash"
      viewBox="0 0 16 16"
    >
      <path d="M3.5 5.5A.5.5 0 0 1 4 5h8a.5.5 0 0 1 .5.5V7H3V5.5zm10-2A1.5 1.5 0 0 0 13 2H3a1.5 1.5 0 0 0-1.5 1.5V14a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5V5.5zM5.5 9a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5zm4 0a.5.5 0 0 1 .5-.5h.5a.5.5 0 0 1 0 1h-.5a.5.5 0 0 1-.5-.5z" />
    </svg>
  );

  return (
    <>
      {show && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
          
          <Alert variant="danger" onClose={onHide} className="d-flex align-items-center" style={{ maxHeight: '60px' }}>
          <div className="mx-2" >
          <FaTrash />
           </div>
          
            {nachricht}
          </Alert>
        </div>
      )}
    </>
  );
};

export default DeleteMessage;
