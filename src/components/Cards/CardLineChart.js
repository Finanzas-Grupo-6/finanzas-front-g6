import React, { useEffect, useState } from "react";
import Chart from "chart.js";
import facturaService from '../../services/facturas';

export default function CardLineChart() {
  const [facturasPorMes, setFacturasPorMes] = useState([]);

  useEffect(() => {
    const fetchFacturasPorMes = async () => {
      try {
        const data = await facturaService.getFacturasPorMes();
        setFacturasPorMes(data);
      } catch (error) {
        console.error("Error al obtener las facturas por mes:", error);
      }
    };

    fetchFacturasPorMes();
  }, []);

  useEffect(() => {
    if (facturasPorMes.length > 0) {
      const ctx = document.getElementById("line-chart").getContext("2d");

      const labels = facturasPorMes.map(f => f.mes);
      const valores = facturasPorMes.map(f => f.total);

      const config = {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Número de Facturas',
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: valores,
              fill: false,
            }
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: false,
            text: "Facturas por Mes",
          },
          legend: {
            labels: {
              fontColor: "white",
            },
            align: "end",
            position: "bottom",
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                gridLines: {
                  display: false,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "rgba(255,255,255,.7)",
                },
                display: true,
                gridLines: {
                  borderDash: [3],
                  borderDashOffset: [3],
                  color: "rgba(255, 255, 255, 0.15)",
                },
              },
            ],
          },
        },
      };

      new Chart(ctx, config);
    }
  }, [facturasPorMes]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
              Overview
            </h6>
            <h2 className="text-white text-xl font-semibold">Facturas según mes de vencimiento</h2>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        {/* Chart */}
        <div className="relative h-350-px">
          <canvas id="line-chart"></canvas>
        </div>
      </div>
    </div>
  );
}
