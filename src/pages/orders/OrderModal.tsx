// CustomModal.tsx

import React, { ReactNode } from 'react';
import Modal from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
          width: '80%', // Passe die Breite nach Bedarf an
          maxWidth: '1000px', // Setze ggf. eine maximale Breite
          margin: 'auto', // Zentriere das Modal horizontal
          marginTop: '30px', // Passe den oberen Abstand nach Bedarf an
        },
      }}
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
