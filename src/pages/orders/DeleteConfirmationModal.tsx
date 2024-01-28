// DeleteConfirmationModal.tsx

import React from 'react';
import CustomModal from './OrderModal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onDeleteConfirmed: () => void;
  isDeleteConfirmation?: boolean; // Füge das Prop hier hinzu
}

const modalStyles = {
    maxWidth: '300px', // Passe die Breite nach Bedarf an
    margin: '0 auto', // Zentriere das Modal horizontal
};

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onRequestClose, onDeleteConfirmed, isDeleteConfirmation }) => {
  return (
    <CustomModal isOpen={isOpen} onRequestClose={onRequestClose} isDeleteConfirmationOpen={isDeleteConfirmation}>
      <div className="p-4 border rounded bg-light" style={modalStyles}>
        <h2>Auftrag löschen</h2>
        <p>Möchten Sie den Auftrag wirklich löschen?</p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-between">
          <button type="button" className="btn btn-danger" onClick={onDeleteConfirmed}>
            Ja, löschen
          </button>
          <button type="button" className="btn btn-secondary" onClick={onRequestClose}>
            Nein, abbrechen
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default DeleteConfirmationModal;
