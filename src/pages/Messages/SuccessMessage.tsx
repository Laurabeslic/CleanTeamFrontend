import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import classNames from "classnames";

interface SuccessMessageProps {
    show: boolean;
    onHide: () => void;
    nachricht: string;
  }
  

  const SuccessMessage: React.FC<SuccessMessageProps> = ({ show, onHide, nachricht }) => {

    
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        onHide();
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [show, onHide]);

  
const Icon = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 130.2 130.2"
      style={{ width: "40px", height: "40px" }}
    >
      <circle
        className="path circle"
        fill="none"
        stroke="#4bd396"
        strokeWidth="6"
        strokeMiterlimit="10"
        cx="65.1"
        cy="65.1"
        r="62.1"
      />
      <polyline
        className="path check"
        fill="none"
        stroke="#4bd396"
        strokeWidth="6"
        strokeLinecap="round"
        strokeMiterlimit="10"
        points="100.2,40.2 51.5,88.8 29.8,67.5 "
      />
    </svg>
  );
};

  return (
    <>
        {show && (
        <div className="position-fixed bottom-0 start-50 translate-middle-x mb-3">
           <div className="logout-checkmark" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon/>
          </div>
          <Alert variant="success" onClose={onHide} className="d-flex align-items-center" style={{maxHeight: '60px'}}>
           
            {nachricht}
          </Alert>
        </div>
      )}
    </>
  );
};

export default SuccessMessage;
