import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";

const PersonalDetails = () => {
  const loggedInUser = useSelector((state: RootState) => state.Auth.user);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(loggedInUser.user);
  const [employeeData, setEmployeeData] = useState<any>(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/mitarbeiter");
        const filteredData = response.data.filter(
          (mitarbeiter: any) => mitarbeiter.UserID === loggedInUser.user.id
        );
        if (filteredData.length > 0) {
          const employee = filteredData[0];
          setEmployeeData({
            MitarbeiterID: employee.MitarbeiterID,
            Name: employee.Name,
            Adresse: employee.Adresse,
            Telefon: employee.Telefon,
            Position: employee.Position,
            Faehigkeiten: employee.Faehigkeiten,
            UserId: employee.UserID
          });
        } else {
          // Falls kein Mitarbeiter mit der zugeordneten UserID gefunden wird, setzen Sie die Benutzerdaten
          setEmployeeData(null);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };
    fetchEmployeeData();
  }, [loggedInUser]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = () => {
    // Hier kannst du die Logik zum Speichern der bearbeiteten Informationen implementieren
    console.log("Bearbeitete Informationen speichern:", editedUser);
    setEditMode(false);
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <div className="text-center mt-2">
          <img
            src={`https://ui-avatars.com/api/?name=${loggedInUser.user.firstName}+${loggedInUser.user.lastName}&background=random`}
            alt=""
            className="avatar-lg rounded-circle"
          />
          <h4 className="mt-2 mb-0">{loggedInUser.user.username}</h4>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 mt-4 pt-2 border-top">
          <h4 className="mb-0 fs-15">Informationen</h4>
          {!editMode && (
            <Button variant="outline-primary" size="sm" onClick={handleEditClick}>
              Bearbeiten
            </Button>
          )}
        </div>
        {editMode ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vorname</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editedUser.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editedUser.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleSaveClick}>
              Speichern
            </Button>
          </Form>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-borderless mb-0 text-muted">
                <tbody>
                  <tr>
                    <th scope="row">Benutzernummer</th>
                    <td>{loggedInUser.user.id}</td>
                  </tr>
                  <tr>
                    <th scope="row">Benutzername</th>
                    <td>{loggedInUser.user.username}</td>
                  </tr>
                  <tr>
                    <th scope="row">Vorname</th>
                    <td>{loggedInUser.user.firstName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Nachname</th>
                    <td>{loggedInUser.user.lastName}</td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>{loggedInUser.user.email}</td>
                  </tr>
                  {employeeData && (
                    <>
                    <tr>
                        <th scope="row">Position</th>
                        <td>{employeeData.Position}</td>
                      </tr>
                      
                      <tr>
                        <th scope="row">Telefon</th>
                        <td>{employeeData.Telefon}</td>
                      </tr>
                    
                      <tr>
                        <th scope="row">Adresse</th>
                        <td>
                          {employeeData.Adresse.Strasse}, {employeeData.Adresse.PLZ}{" "}
                          {employeeData.Adresse.Stadt}, {employeeData.Adresse.Land}
                        </td>
                      </tr>
                      <tr className="mt-3 pt-2 border-top">
                        <th scope="row">Fähigkeiten</th>
                        <td>
                          {employeeData.Faehigkeiten.map((skill: string, index: number) => (
                            <span key={index} className="badge badge-soft-primary me-1">
                              {skill}
                            </span>
                          ))}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default PersonalDetails;
