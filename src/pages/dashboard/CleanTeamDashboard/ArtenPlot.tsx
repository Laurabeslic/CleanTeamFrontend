import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Dropdown } from "react-bootstrap";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface AuftraegeArtChartProps {
  apiUrl: string;
}

const AuftraegeArtChart: React.FC<AuftraegeArtChartProps> = ({ apiUrl }) => {
  const [auftraege, setAuftraege] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuftraege() {
      try {
        const response = await axios.get(apiUrl);
        setAuftraege(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Auftraege:", error);
        setLoading(false);
      }
    }

    fetchAuftraege();
  }, [apiUrl]);

  if (loading) return <div>Loading...</div>;

  const categories = Array.from(new Set(auftraege.map((auftrag) => auftrag.Auftragsart)));
  const data = categories.map((category) => auftraege.filter((auftrag) => auftrag.Auftragsart === category).length);

  const apexChartOpts: ApexOptions = {
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: undefined,
              offsetY: -10,
              formatter: function (val) {
                return val;
              },
            },
          },
        },
        expandOnClick: false,
      },
    },
    chart: {
      height: 291,
      type: "donut",
    },
    legend: {
      show: true,
      position: "right",
      horizontalAlign: "left",
      itemMargin: {
        horizontal: 6,
        vertical: 3,
      },
    },
    labels: categories,
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Card>
      <Card.Body>

        <h5 className="card-title mt-0 mb-0 header-title">Aufträge nach Art</h5>

        <Chart
          options={apexChartOpts}
          series={data}
          type="donut"
          className="apex-charts mb-0 mt-4"
          height={291}
        />
      </Card.Body>
    </Card>
  );
};

export default AuftraegeArtChart;
