import React from 'react';
import { Modal } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDeleteConfirmed: () => void;
  isDeleteConfirmation?: boolean; 
  art: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onRequestClose, onDeleteConfirmed, isDeleteConfirmation, art }) => {
    return (
      <Modal
          show={isOpen}
          centered
        >
          <Modal.Header>
            <Modal.Title as="h5">{art} löschen</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
          <i className="text-warning display-3">
          <FaTrash />
          </i>
            <h4 className="text-danger mt-4">Möchten Sie den {art === 'Kunde' ? 'Kunden' : art} wirklich löschen?</h4>
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

