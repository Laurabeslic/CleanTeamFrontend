import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import CreateForm from "../pages/User/CreateUserForm";

interface CreateNewProps {
  otherOptions: {
    id: number;
    label: string;
    icon: string;
  }[];
}

const CreateNew = ({ otherOptions }: CreateNewProps) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [createFormOpen, setCreateFormOpen] = useState<boolean>(false);

  /*
   * toggle dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleCreateForm = () => {
    setCreateFormOpen(!createFormOpen);
    setDropdownOpen(false); 
  };

  return (
    <>
      <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
        <Dropdown.Toggle
          id="dropdown-notification"
          as="button"
          onClick={toggleDropdown}
          className={classNames("nav-link", {
            show: dropdownOpen,
          })}
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
            borderRadius: "0",
            color: "inherit",
          }}
        >
          Erstellen <i className="uil uil-angle-down"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          <div onClick={toggleDropdown}>
            {(otherOptions || []).map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {/* {index === otherOptions.length - 1 && (
                    <div className="dropdown-divider"></div>
                  )} */}

                {item.label === "Neuer Benutzer" ? (
                    <button className="dropdown-item" onClick={toggleCreateForm}>
                      <i className={classNames(item.icon, "me-1")}></i>
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <div key={index} className="dropdown-item">
                    <Link key={index} to="#" className="dropdown-item">
                      <i className={classNames(item.icon, "me-1")}></i>
                      <span>{item.label}</span>
                    </Link>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Dropdown.Menu>
      </Dropdown>
      {createFormOpen && <CreateForm isOpen={createFormOpen} onClose={toggleCreateForm}/>}
    </>
  );
};

export default CreateNew;
