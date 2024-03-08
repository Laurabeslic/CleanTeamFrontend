import React, { useState } from "react";
import {Button, Modal } from "react-bootstrap";
import axios from 'axios';

interface CreateMitarbeiterFormProps {
    isOpen: boolean;
    onCreate: (newMitarbeiterData: any) => void;
    onClose: () => void;
  }

const CreateForm: React.FC<CreateMitarbeiterFormProps>=({isOpen, onCreate, onClose}) =>{
const[name, setName] = useState("");
const [strasse, setStrasse] = useState("");
const [stadt, setStadt] = useState("");
const [plz, setPLZ] = useState("");
const [land, setLand] = useState("");
const [telefon, setTelefon] = useState("");
const [position, setPosition] = useState("");
const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['name', 'telefon', 'strasse', 'plz', 'stadt', 'land', 'position'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

    const newMitarbeiterData = {
       Name: name,
       Telefon: telefon,
       Position: position,
        Adresse: {
          Strasse: strasse,
          Stadt: stadt,
          PLZ: plz,
          Land: land,
        },
      };

    onCreate(newMitarbeiterData);

    // Felder zurücksetzen
    setName("");
    setTelefon("");
    setPosition("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");

    onClose();
  };

const closeForm = async(e: React.FormEvent) => {
    setName("");
    setPosition("");
    setTelefon("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");
    setFieldErrors({});
    
    onClose();
  };

  if (!isOpen) {
    return null;
  }

return (
    <Modal
        show={isOpen}
        scrollable
      >
        <Modal.Header >
          <Modal.Title as="h5">Neuer Mitarbeiter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="p-4 border rounded bg-light">
           <div className="col-md-6 mb-3">
               <label htmlFor="name" className="form-label">
                 Name:
               </label>
               <input
                type="text"
                id="name"
                className={`form-control ${fieldErrors['name'] ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="telefon" className="form-label">
                Telefonnummer:
              </label>
              <input
                type="text"
                id="telefon"
                className={`form-control ${fieldErrors['telefon'] ? 'is-invalid' : ''}`}
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="email" className="form-label">
                Position:
              </label>
              <input
                type="text"
                id="email"
                className={`form-control ${fieldErrors['position'] ? 'is-invalid' : ''}`}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="row">
            <div className="col-md-4 mb-3">
                <label htmlFor="strasse" className="form-label">
                Straße:
                </label>
                <input
                type="text"
                id="strasse"
                className={`form-control ${fieldErrors['strasse'] ? 'is-invalid' : ''}`}
                value={strasse}
                onChange={(e) => setStrasse(e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label htmlFor="plz" className="form-label">
                PLZ:
                </label>
                <input
                type="text"
                id="plz"
                className={`form-control ${fieldErrors['plz'] ? 'is-invalid' : ''}`}
                value={plz}
                onChange={(e) => setPLZ(e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label htmlFor="stadt" className="form-label">
                Stadt:
                </label>
                <input
                type="text"
                id="stadt"
                className={`form-control ${fieldErrors['stadt'] ? 'is-invalid' : ''}`}
                value={stadt}
                onChange={(e) => setStadt(e.target.value)}
                />
            </div>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="land" className="form-label">
                Land:
              </label>
              <input
                type="text"
                id="land"
                className={`form-control ${fieldErrors['land'] ? 'is-invalid' : ''}`}
                value={land}
                onChange={(e) => setLand(e.target.value)}
              />
            </div>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary">Mitarbeiter erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
};
export default CreateForm;