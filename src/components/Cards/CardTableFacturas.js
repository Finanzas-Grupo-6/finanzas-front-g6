import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import facturaService from "../../services/facturas";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CardTable({ color }) {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const data = await facturaService.getFacturas();
        setFacturas(data);
      } catch (err) {
        setError("Error al cargar las facturas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Listado de Facturas", 14, 10);

    doc.autoTable({
      startY: 20,
      head: [["Cliente", "Número de Factura", "Monto", "Moneda", "Fecha de Vencimiento"]],
      body: facturas.map((factura) => [
        factura.cliente,
        factura.numeroFactura,
        factura.monto.toFixed(2),
        factura.moneda,
        factura.fechaVencimiento.split("T")[0],
      ]),
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255],
      },
      tableLineColor: [0, 0, 0],
      tableLineWidth: 0.1,
    });

    doc.save("Listado_Facturas.pdf");
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
          <h3
            className={
              "font-semibold text-lg " +
              (color === "light" ? "text-blueGray-700" : "text-white")
            }
          >
            Listado de Facturas
          </h3>
          <button
            onClick={exportToPDF}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
          >
            Exportar a PDF
          </button>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Cliente", "Número de Factura", "Monto", "Moneda", "Fecha de Vencimiento"].map((header) => (
                  <th
                    key={header}
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                    }
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {factura.cliente}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {factura.numeroFactura}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {factura.monto.toFixed(2)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {factura.moneda}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {factura.fechaVencimiento.split("T")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
