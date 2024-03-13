import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector} from "react-redux";
import { RootState} from "../../redux/store";
import axios from 'axios';
import {Button, Modal } from "react-bootstrap";

interface CreateFirmenwagenFormProps {
  isOpen: boolean;
  onCreate: (newFirmenwagenData: any) => void;
  onClose: () => void;
}

const CreateForm: React.FC<CreateFirmenwagenFormProps> = ({ isOpen, onCreate, onClose }) => {
  const [kennzeichen, setKennzeichen] = useState("");
  const [marke, setMarke] = useState("");
  const [modell, setModell] = useState("");
  const [farbe, setFarbe] = useState("");
  const [kilometerstand, setKilometerstand] = useState("");
  const [tankvolumen, setTankvolumen] = useState("");
  const [baujahr, setBaujahr] = useState("");
  const [kraftstoffart, setKraftstoffart] = useState("");
  const [letzteWartung, setLetzteWartung] = useState(new Date());
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  const loggedInUser = useSelector((state: RootState) => state.Auth.user);


  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['kennzeichen', 'marke', 'modell', 'baujahr', 'farbe', 'tankvolumen', 'kraftstoffart', 'kilometerstand'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    setFieldErrors(errors);

      // Überprüfen, ob die baujahr eine Zahl ist
  const isBaujahrValid = /^\d+$/.test(baujahr);
  const isKilometerstandValid = /^\d*$/.test(kilometerstand) || kilometerstand === '';
  const isTankvolumenValid = /^\d+$/.test(tankvolumen);

  if (!isBaujahrValid || !isKilometerstandValid || !isTankvolumenValid) {
    setFieldErrors(prevErrors => ({
      ...prevErrors,
      baujahr: !isBaujahrValid,
      kilometerstand: !isKilometerstandValid,
      tankvolumen: !isTankvolumenValid
    }));
    return;
  }



    if (Object.values(errors).some(error => error)) {
      return;
    }
    

     // Umwandeln des Datums in ISO-8601-Format
     const isoFormattedDate = letzteWartung.toISOString();

   // const USER = loggedInUser.user.id;


    const newFirmenwagenData = {
        Kennzeichen: kennzeichen,
        Marke: marke,
        Modell: modell,
        Baujahr: baujahr,
        Farbe: farbe, 
        Kilometerstand: kilometerstand,
        Tankvolumen: tankvolumen,
        Kraftstoffart: kraftstoffart,
        LetzteWartung: letzteWartung
      };

    onCreate(newFirmenwagenData);

    setKennzeichen("");
    setMarke("");
    setModell("");
    setBaujahr("");
    setFarbe("");
    setKilometerstand("");
    setTankvolumen("");
    setKraftstoffart("");

    onClose();
  };

  const closeForm = async(e: React.FormEvent) => {
    setKennzeichen("");
    setMarke("");
    setModell("");
    setBaujahr("");
    setFarbe("");
    setKilometerstand("");
    setTankvolumen("");
    setKraftstoffart("");
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
          <Modal.Title as="h5">Neuer Firmenwagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="p-4 border rounded bg-light">
           <div className="col-md-6 mb-3">
               <label htmlFor="kennzeichen" className="form-label">
                 Kennzeichen:
               </label>
               <input
                type="text"
                id="kennzeichen"
                className={`form-control ${fieldErrors['kennzeichen'] ? 'is-invalid' : ''}`}
                value={kennzeichen}
                onChange={(e) => setKennzeichen(e.target.value)}
              />
               {fieldErrors['kennzeichen'] && (
              <div className="invalid-feedback">{fieldErrors['kennzeichen']}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="marke" className="form-label">
                Marke:
              </label>
              <input
                type="text"
                id="marke"
                className={`form-control ${fieldErrors['marke'] ? 'is-invalid' : ''}`}
                value={marke}
                onChange={(e) => setMarke(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="modell" className="form-label">
                Modell:
              </label>
              <input
                type="text"
                id="modell"
                className={`form-control ${fieldErrors['modell'] ? 'is-invalid' : ''}`}
                value={modell}
                onChange={(e) => setModell(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
                <label htmlFor="baujahr" className="form-label">
                Baujahr:
                </label>
                <input
                type="text"
                id="baujahr"
                className={`form-control ${fieldErrors['baujahr'] ? 'is-invalid' : ''}`}
                value={baujahr}
                onChange={(e) => setBaujahr(e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label htmlFor="farbe" className="form-label">
                Farbe:
                </label>
                <input
                type="text"
                id="farbe"
                className={`form-control ${fieldErrors['farbe'] ? 'is-invalid' : ''}`}
                value={farbe}
                onChange={(e) => setFarbe(e.target.value)}
                />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="tankvolumen" className="form-label">
                Tankvolumen:
              </label>
              <input
                type="text"
                id="tankvolumen"
                className={`form-control ${fieldErrors['tankvolumen'] ? 'is-invalid' : ''}`}
                value={tankvolumen}
                onChange={(e) => setTankvolumen(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="kraftstoffart" className="form-label">
                Kraftstoffart:
              </label>
              <input
                type="text"
                id="kraftstoffart"
                className={`form-control ${fieldErrors['kraftstoffart'] ? 'is-invalid' : ''}`}
                value={kraftstoffart}
                onChange={(e) => setKraftstoffart(e.target.value)}
              />
            </div>

            <div className="col-md-4 mb-3">
                <label htmlFor="kilometerstand" className="form-label">
                Kilometerstand:
                </label>
                <input
                type="text"
                id="kilometerstand"
                className={`form-control ${fieldErrors['kilometerstand'] ? 'is-invalid' : ''}`}
                value={kilometerstand}
                onChange={(e) => setKilometerstand(e.target.value)}
                />
            </div>
            

            <div className="col-md-4 mb-3">
                <label htmlFor="datum" className="form-label">
                Letzte Wartung:
                </label>
                <DatePicker
                id="datum"
                className="form-control"
                selected={letzteWartung}
                onChange={(date: Date) => setLetzteWartung(date)}
                dateFormat="dd.MM.yyyy"
                />
                </div>
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary"> Firmenwagen hinzufügen</Button>
        </Modal.Footer>
      </Modal>
  );
  
};

export default CreateForm;
