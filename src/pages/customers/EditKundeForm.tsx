import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Modal } from "react-bootstrap";

interface EditKundeFormProps {
  editedKunde: {
    KundenID: string,
    Name: string,
    Telefon: string,
    Email: string,
    Adresse: {
      Strasse: string,
      Stadt: string,
      PLZ: string,
      Land: string,
    },
  };
  isOpen: boolean;
  onUpdate: (KundenId: string, updatedData: { Name: string; Telefon: string; Email: string; Adresse: { Strasse: string; PLZ: string; Stadt: string; Land: string } }) => void;
  onClose: () => void;
}

const EditKundeForm: React.FC<EditKundeFormProps> = ({ editedKunde, isOpen, onUpdate, onClose }) => {
  const [editedName, setEditedName] = useState("");
  const [editedTelefon, setEditedTelefon] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedStrasse, setEditedStrasse] = useState("");
  const [editedPLZ, setEditedPLZ] = useState("");
  const [editedStadt, setEditedStadt] = useState("");
  const [editedLand, setEditedLand] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchKunde = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/Kunde/${editedKunde?.KundenID}`);
        const { Adresse } = response.data;
        setEditedName(response.data.Name);
        setEditedTelefon(response.data.Telefon);
        setEditedEmail(response.data.Email);
        setEditedStrasse(Adresse.Strasse);
        setEditedPLZ(Adresse.PLZ);
        setEditedStadt(Adresse.Stadt);
        setEditedLand(Adresse.Land);
      } catch (error) {
        console.error('Fehler beim Abrufen des Kunden:', error);
      }
    };

    fetchKunde();
  }, [editedKunde?.KundenID]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleTelefonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTelefon(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEmail(e.target.value);
  };

  const handleStrasseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedStrasse(e.target.value);
  };

  const handlePLZChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPLZ(e.target.value);
  };

  const handleStadtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedStadt(e.target.value);
  };

  const handleLandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedLand(e.target.value);
  };

  const handleUpdate = () => {
    // Überprüfe, ob alle Felder ausgefüllt sind
    const requiredFields = ['editedName', 'editedTelefon', 'editedEmail', 'editedStrasse', 'editedPLZ', 'editedStadt', 'editedLand'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

    onUpdate(editedKunde?.KundenID, {
      Name: editedName,
      Telefon: editedTelefon,
      Email: editedEmail,
      Adresse: { Strasse: editedStrasse, PLZ: editedPLZ, Stadt: editedStadt, Land: editedLand }
    });
    onClose();
  };

  const closeForm = async(e: React.FormEvent) => {
    setFieldErrors({});
    onClose();
  };

  return (
    <Modal
      show={isOpen}
      scrollable
    >
      <Modal.Header>
        <Modal.Title as="h5">Kunde bearbeiten</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleUpdate} className="p-4 border rounded bg-light">
          <div className="col-md-6 mb-3">
            <label>Kundennummer:</label>
            <input type="text" value={editedKunde?.KundenID} readOnly className="form-control" />
          </div>

          <div className="col-md-6 mb-3">
            <label>Name:</label>
            <input type="text" value={editedName} className={`form-control ${fieldErrors['editedName'] ? 'is-invalid' : ''}`} onChange={handleNameChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Telefon:</label>
            <input type="text" value={editedTelefon} className={`form-control ${fieldErrors['editedTelefon'] ? 'is-invalid' : ''}`} onChange={handleTelefonChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email:</label>
            <input type="text" value={editedEmail} className={`form-control ${fieldErrors['editedEmail'] ? 'is-invalid' : ''}`} onChange={handleEmailChange} />
          </div>

          <div className=" col-md-6 mb-3">
            <label>Straße:</label>
            <input type="text" value={editedStrasse} className={`form-control ${fieldErrors['editedStrasse'] ? 'is-invalid' : ''}`} onChange={handleStrasseChange} />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label>PLZ:</label>
              <input type="text" value={editedPLZ} className={`form-control ${fieldErrors['editedPLZ'] ? 'is-invalid' : ''}`} onChange={handlePLZChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label>Stadt:</label>
              <input type="text" value={editedStadt} className={`form-control ${fieldErrors['editedStadt'] ? 'is-invalid' : ''}`} onChange={handleStadtChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label>Land:</label>
              <input type="text" value={editedLand} className={`form-control ${fieldErrors['editedLand'] ? 'is-invalid' : ''}`} onChange={handleLandChange} />
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={closeForm}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleUpdate}>Speichern</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditKundeForm;
