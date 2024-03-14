import React, { useState } from "react";
import {Button, Modal } from "react-bootstrap";
import axios from 'axios';

interface CreateKundeFormProps {
    isOpen: boolean;
    onCreate: (newKundeData: any) => void;
    onClose: () => void;
  }

const CreateForm: React.FC<CreateKundeFormProps>=({isOpen, onCreate, onClose}) =>{
const[name, setName] = useState("");
const [strasse, setStrasse] = useState("");
const [stadt, setStadt] = useState("");
const [plz, setPLZ] = useState("");
const [land, setLand] = useState("");
const [telefon, setTelefon] = useState("");
const [email, setEmail] = useState("");
const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['name', 'telefon', 'email', 'strasse', 'plz', 'stadt', 'land'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

     // Überprüfen, ob die PLZ eine Zahl ist
     const isPLZValid = /^\d+$/.test(plz);
    
     if (!isPLZValid) {
       // Zeige eine Fehlermeldung an, wenn die PLZ keine Zahl ist
       setFieldErrors({ ...fieldErrors, plz: true });
       return;
     }
    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

    const newKundeData = {
       Name: name,
       Telefon: telefon,
       Email: email,
        Adresse: {
          Strasse: strasse,
          Stadt: stadt,
          PLZ: plz,
          Land: land,
        },
      };

    onCreate(newKundeData);

    // Felder zurücksetzen
    setName("");
    setTelefon("");
    setEmail("");
    setStrasse("");
    setStadt("");
    setPLZ("");
    setLand("");

    onClose();
  };

const closeForm = async(e: React.FormEvent) => {
    setName("");
    setEmail("");
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
          <Modal.Title as="h5">Neuer Kunde</Modal.Title>
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
                E-Mail:
              </label>
              <input
                type="text"
                id="email"
                className={`form-control ${fieldErrors['email'] ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
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

            <div className="row">
            
            <div className="col-md-3 mb-3">
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
            <div className="col-md-5 mb-3">
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
            </div>

           
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary"> Kunde erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
};
export default CreateForm;