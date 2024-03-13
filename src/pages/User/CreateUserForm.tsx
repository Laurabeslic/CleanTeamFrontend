import React, { useState } from "react";
import {Button, Modal, Form } from "react-bootstrap";
import axios from 'axios';

interface CreateUserFormProps {
    isOpen: boolean;
    onClose: () => void;
  }


const CreateForm: React.FC<CreateUserFormProps>=({isOpen, onClose}) =>{
const[firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");
const [email, setEmail] = useState("");
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [passwordConfirmed, setPasswordConfirmed] = useState("");
const [role, setRole] = useState("");

const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = ['firstName', 'lastName', 'email', 'username', 'password', 'passwordConfirmed', 'role'];
    const errors: { [key: string]: boolean } = {};

    requiredFields.forEach(field => {
      errors[field] = !eval(field);
    });

    if (password !== passwordConfirmed) {
        errors['passwordMatch'] = true;
    }

    setFieldErrors(errors);

    if (Object.values(errors).some(error => error)) {
      return;
    }

    const newUserData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        role: role
      };

    CreateUser(newUserData);

    // Felder zurücksetzen
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setPasswordConfirmed("");
    setRole("");

    onClose();
  };

  const CreateUser = async (newUserData: any) => {
    try {
        console.log(newUserData);
       const response = await axios.post(`http://localhost:3001/user/register`, newUserData);
        onClose();
      } catch (error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
      }
  };

const closeForm = async(e: React.FormEvent) => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setUsername("");
    setPassword("");
    setPasswordConfirmed("");
    setRole("");

    setFieldErrors({});
    
    onClose();
  };
  const RoleDropdown = ({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => (
    <select className="form-select" value={value} onChange={onChange}>
      <option value=""></option>
      <option value="User">User</option>
      <option value="Admin">Admin</option>
    </select>
  );

  if (!isOpen) {
    return null;
  }
  

return (
    <Modal
        show={isOpen}
        scrollable
      >
        <Modal.Header >
          <Modal.Title as="h5">Neuer Benutzer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form className="p-4 border rounded bg-light">

        <div className="row">
           <div className="col-md-6 mb-3">
               <label htmlFor="vorname" className="form-label">
                 Vorname:
               </label>
               <input
                type="text"
                id="vorname"
                className={`form-control ${fieldErrors['firstName'] ? 'is-invalid' : ''}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="nachname" className="form-label">
                Nachname:
              </label>
              <input
                type="text"
                id="nachname"
                className={`form-control ${fieldErrors['lastName'] ? 'is-invalid' : ''}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            </div>

            <div className="col-md-12 mb-3">
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

            <div className="row">
            <div className="col-md-6 mb-3">
                <label htmlFor="benutzername" className="form-label">
                Benutzername:
                </label>
                <input
                type="text"
                id="benutzername"
                className={`form-control ${fieldErrors['username'] ? 'is-invalid' : ''}`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="rolle" className="form-label">
                Rolle:
              </label>
              <select className={`form-select ${fieldErrors['role'] ? 'is-invalid' : ''}`} 
              value={role} onChange={(e) => setRole(e.target.value)}>
                <option value=""></option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                </select>
            </div>
            </div>

            <div className="row">
            
            <div className="col-md-6 mb-3">
                <label htmlFor="passwort" className="form-label">
                Passwort:
                </label>
                <input
                type="password"
                id="passwort"
                className={`form-control ${fieldErrors['password'] ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="col-md-6 mb-3">
                <label htmlFor="passworterneut" className="form-label">
                Passwort bestätigen:
                </label>
                <input
                type="password"
                id="passworterneut"
                className={`form-control ${fieldErrors['passwordConfirmed'] ? 'is-invalid' : ''}`}
                value={passwordConfirmed}
                onChange={(e) => setPasswordConfirmed(e.target.value)}
                />
                
            </div>
            {fieldErrors['passwordMatch'] && (
                        <div className="text-danger">
                        <p>Passwörter stimmen nicht überein!</p>
                      </div>
                        )}
            </div>
         
          </form>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={closeForm}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} variant="primary">Benutzer erstellen</Button>
        </Modal.Footer>
      </Modal>
  );
};
export default CreateForm;