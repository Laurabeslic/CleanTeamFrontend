import React, { useState } from "react";
import { Row, Col, Dropdown, ButtonGroup } from "react-bootstrap";
import FeatherIcon from "feather-icons-react";

// components
import ShreyuDatepicker from "../../../components/Datepicker";
import MembersList from "../../../components/MembersList";
import Tasks from "../../../components/Tasks";
import ChatList from "../../../components/ChatList";

import Statistics from "../Ecommerce/Statistics";
import OverView from "./OverView";
import ArtenPlot from "./ArtenPlot";
import AuftraegeChart from "./AuftraegeProMonatChart";
import RecentAuftraege from "./RecentAufträge";
import RevenueChart from "../Ecommerce/RevenueChart";
import TargetChart from "../Ecommerce/TargetChart";
import SalesChart from "../Ecommerce/SalesChart";
import Orders from "../Ecommerce/Orders";



// dummy data
import { orderDetails, topPerformers, tasks, chatMessages } from "../Ecommerce/data";


const EcommerceDashboard = () => {

  // const [dateRange, setDateRange] = useState<any>([
  //   new Date(),
  //   new Date().setDate(new Date().getDate() + 7),
  // ]);
  // const [startDate, endDate] = dateRange;

  /*
   * handle date change
   */
  // const onDateChange = (date: Date) => {
  //   if (date) {
  //     setDateRange(date);
  //   }
  // };



  return (
    <>
      <Row>
        <Col>
          <div className="page-title-box">
            <h4 className="page-title">Dashboard</h4>
          </div>
        </Col>
      </Row>

      <Row>
        <Col xl={3}>
          <OverView />
        </Col>
        <Col xl={9}>
          <AuftraegeChart apiUrl="http://localhost:3001/auftrag"/>
        </Col>
      </Row>

      <Row>
        <Col xl={5}>
          <ArtenPlot apiUrl="http://localhost:3001/auftrag" />
        </Col>
        <Col xl={7}>
          <RecentAuftraege/>
        </Col>
      </Row>

     
    </>
  );
};

export default EcommerceDashboard;
