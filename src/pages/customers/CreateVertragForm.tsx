import React, { useState } from "react";
import {Button, Modal } from "react-bootstrap";
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CreateVertragFormProps {
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
    onCreate: (newVertragData: any) => void;
    onClose: () => void;
  }

const CreateVertragForm: React.FC<CreateVertragFormProps>=({editedKunde, isOpen, onCreate, onClose}) =>{
    const [details, setDetails] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
    
    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = ['details', 'selectedDate'];
        const errors: { [key: string]: boolean } = {};
    
        requiredFields.forEach(field => {
          errors[field] = !eval(field);
        });
    
        setFieldErrors(errors);
    
        if (Object.values(errors).some(error => error)) {
          return;
        }
    
        const newVertragData = {
           KundenID: editedKunde?.KundenID,
           Details: details,
           Gueltigkeitsdatum: selectedDate,
          };
    
        onCreate(newVertragData);
    
        // Felder zurücksetzen
        setDetails("");
        setSelectedDate(new Date());
    
        onClose();
    
      };

      
    const closeForm = async(e: React.FormEvent) => {
   
        setDetails("");
        setSelectedDate(new Date());
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
              <Modal.Title as="h5">Neuer Vertrag</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form className="p-4 border rounded bg-light">
               <div className="col-md-6 mb-3">
                   <label>
                     Kundennummer:
                   </label>
                   <input
                    type="text"
                    className="form-control"
                    value={editedKunde?.KundenID}
                    readOnly
                  />
                </div>
    
                <div className="col-md-6 mb-3">
                  <label htmlFor="details" className="form-label">
                    Details:
                  </label>
                  <input
                    type="text"
                    id="details"
                    className={`form-control ${fieldErrors['details'] ? 'is-invalid' : ''}`}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>
    
                <div className="row">
                    <div className="col-md-4 mb-2">
                    <label htmlFor="datum" className="form-label">
                        Gültigkeitsdatum:
                    </label>
                    <DatePicker
                    id="datum"
                    className={`form-control ${fieldErrors['selectedDate'] ? 'is-invalid' : ''}`}
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    />
                    </div>
                </div>
              </form>
              
            </Modal.Body>
            <Modal.Footer>
              <Button variant="light" onClick={closeForm}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmit} variant="primary"> Vertrag erstellen</Button>
            </Modal.Footer>
          </Modal>
      );
};
export default CreateVertragForm;