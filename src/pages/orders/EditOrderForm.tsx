import React, { useState } from 'react';

interface EditOrderFormProps {
  editedOrder: { id: string; details: string }; // Hier solltest du die tatsächlichen Typen verwenden
  onUpdate: (orderId: string, updatedData: { details: string }) => void;
  onClose: () => void;
}

const EditOrderForm: React.FC<EditOrderFormProps> = ({ editedOrder, onUpdate, onClose }) => {
  const [editedDetails, setEditedDetails] = useState(editedOrder.details);

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDetails(e.target.value);
  };

  const handleUpdate = () => {
    onUpdate(editedOrder.id, { details: editedDetails });
    onClose();
  };

  return (
    <div>
      <h2>Bearbeiten</h2>
      <label htmlFor="editedDetails">Details:</label>
      <input
        type="text"
        id="editedDetails"
        value={editedDetails}
        onChange={handleDetailsChange}
      />
      <button onClick={handleUpdate}>Aktualisieren</button>
      <button onClick={onClose}>Abbrechen</button>
    </div>
  );
};

export default EditOrderForm;
