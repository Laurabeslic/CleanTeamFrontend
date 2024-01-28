// CustomModal.tsx

import React, { ReactNode } from 'react';
import Modal from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  isDeleteConfirmationOpen?: boolean; // Neues Prop, um zu überprüfen, ob es sich um eine Löschbestätigung handelt
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, children, isDeleteConfirmationOpen }) => {
  const modalStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      width: isDeleteConfirmationOpen ? '30%' : '1000px', // Passe die Breite nach Bedarf an
      height: isDeleteConfirmationOpen ? '40%': 'auto',
      marginTop: isDeleteConfirmationOpen ? '12%' : '3%',
      marginLeft: isDeleteConfirmationOpen? '35%':'15%',
      maxWidth: '1000px', // Setze ggf. eine maximale Breite
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal"
      style={modalStyles}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
