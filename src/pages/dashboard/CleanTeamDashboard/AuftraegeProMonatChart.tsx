import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Dropdown } from "react-bootstrap";
import Chart from "react-apexcharts"; 
import { ApexOptions } from "apexcharts";

interface ChartProps {
  apiUrl: string;
}

const AuftraegeProMonatChart: React.FC<ChartProps> = ({ apiUrl }) => {
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

  const months = Array.from(Array(12).keys()); // Array von 0 bis 11 (für die Monate Januar bis Dezember)
  const labels = months.map((month) => new Date(0, month).toLocaleString("en-us", { month: "short" }));

  const data = months.map((month) => auftraege.filter((auftrag) => new Date(auftrag.Datum).getMonth() === month).length);

  const apexChartOpts: ApexOptions = {
    chart: {
      height: 329,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    series: [
      {
        name: "Aufträge",
        data: data,
      },
    ],
    legend: {
      show: false,
    },
    colors: ["#43d39e"],
    xaxis: {
      type: "category",
      categories: labels,
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {},
    },
    yaxis: {
      labels: {
        formatter: (val: number) => {
          return val.toString();
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [45, 100],
      },
    },
  };

  return (
    <Card>
      <Card.Body>

        <h5 className="card-title mb-0 header-title">Aufträge pro Monat</h5>

        <Chart
          options={apexChartOpts}
          series={apexChartOpts.series}
          type="area"
          className="apex-charts mt-3"
          height={329}
          dir="ltr"
        />
      </Card.Body>
    </Card>
  );
};

export default AuftraegeProMonatChart;
