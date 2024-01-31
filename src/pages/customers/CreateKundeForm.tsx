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

const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

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
               <label htmlFor="Name" className="form-label">
                 Name:
               </label>
               <input
                type="text"
                id="Name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="Telefon" className="form-label">
                Telefonnummer:
              </label>
              <input
                type="text"
                id="Telefon"
                className="form-control"
                value={telefon}
                onChange={(e) => setTelefon(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="Email" className="form-label">
                E-Mail:
              </label>
              <input
                type="text"
                id="Email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
          <Button onClick={handleSubmit} variant="primary"> Kunde erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
};
export default CreateForm;