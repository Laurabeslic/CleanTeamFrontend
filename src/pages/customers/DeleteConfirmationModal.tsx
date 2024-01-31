import React from 'react';
import { Modal } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDeleteConfirmed: () => void;
  isDeleteConfirmation?: boolean; 
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onRequestClose, onDeleteConfirmed, isDeleteConfirmation }) => {
    return (
      <Modal
          show={isOpen}
          centered
        >
          <Modal.Header>
            <Modal.Title as="h5">Kunde löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
          <i className="text-warning display-3">
          <FaTrash />
          </i>
            <h4 className="text-danger mt-4">Möchten Sie den Kunden wirklich löschen?</h4>
          </Modal.Body>
          <Modal.Footer>
        
             <button type="button" className="btn btn-secondary" onClick={onRequestClose}>
               Nein, abbrechen
             </button>
  
             <button type="button" className="btn btn-danger" onClick={onDeleteConfirmed}>
               Ja, löschen
             </button>
          </Modal.Footer>
        </Modal>
    );
  };
  
  export default DeleteConfirmationModal;

