import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import classNames from "classnames";
import FeatherIcon from "feather-icons-react";

// utils
import { splitArray } from "../../utils/";

// apps icon
import slackIcon from "./icons/slack.png";
import bitbucketIcon from "./icons/bitbucket.png";
import dribbbleIcon from "./icons/dribbble.png";
import dropboxIcon from "./icons/dropbox.png";
import githubIcon from "./icons/github.png";
import gSuiteIcon from "./icons/g-suite.png";
import outlookIcon from "./icons/outlook-logo.png";

// get the apps
const Apps = [
  // {
  //   name: "Slack",
  //   icon: slackIcon,
  //   redirectTo: "/",
  // },
  // {
  //   name: "GitHub",
  //   icon: githubIcon,
  //   redirectTo: "/",
  // },
  // {
  //   name: "Dribbble",
  //   icon: dribbbleIcon,
  //   redirectTo: "/",
  // },
  // {
  //   name: "Bitbucket",
  //   icon: bitbucketIcon,
  //   redirectTo: "/",
  // },
  {
    name: "Dropbox",
    icon: dropboxIcon,
    redirectTo: "https://www.dropbox.com/", // Redirect Dropbox to the actual Dropbox URL
    newTab: true, // Open in a new tab
  },
  // {
  //   name: "G Suite",
  //   icon: gSuiteIcon,
  //   redirectTo: "/",
  // },
  {
    name: "Outlook", // Add Outlook
    icon: outlookIcon,
    redirectTo: "https://outlook.com", // Set Outlook redirect link
    newTab: true, // Open in a new tab
  },
];

const AppsDropdown = () => {
  const apps = Apps || [];
  const chunk_size = 3;
  const appsChunks = splitArray(apps, chunk_size);

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  /*
   * toggle apps-dropdown
   */
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
      <Dropdown.Toggle
        id="dropdown-apps"
        as="a"
        onClick={toggleDropdown}
        className={classNames("nav-link", "cursor-pointer", {
          show: dropdownOpen,
        })}
      >
        <FeatherIcon icon="grid" />
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: "200px" }} className="dropdown-menu-end p-0 dropdown-menu-m">
        <div className="p-1">
          {(appsChunks || []).map((chunk, idx) => (
            <div className="row g-0" key={idx}>
              {(chunk || []).map((item, i) => (
                <div className="col" key={i}>
                  <Link
                    className="dropdown-icon-item"
                    to={item.redirectTo}
                    target={item.newTab ? "_blank" : "_self"} // Open in a new tab if specified
                  >
                    {item.name === "Outlook" ? (
                      <img src={item.icon} alt="" style={{ width: "40px", height: "auto" }} />
                    ) : (
                      <img src={item.icon} alt="" />
                    )}
                    <span>{item.name}</span>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AppsDropdown;
