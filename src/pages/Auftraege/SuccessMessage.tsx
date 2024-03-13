import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import classNames from "classnames";

interface SuccessMessageProps {
    show: boolean;
    onHide: () => void;
    art: string;
  }

  const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, onHide, art }) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [show, onHide]);

  return (
    <>
      {show && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
          <Alert variant="success" onClose={onHide} >
            {art} erfolgreich erstellt
          </Alert>
        </div>
      )}
    </>
  );
};

export default SuccessMessage;
