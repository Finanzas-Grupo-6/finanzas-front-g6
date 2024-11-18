import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import carteraService from '../../services/carteras';
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CardTable({ color }) {
  const [carteras, setCarteras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useHistory();

  const fetchCarteras = async () => {
    setLoading(true);
    try {
      const data = await carteraService.getCarteras();
      setCarteras(data);
    } catch (err) {
      setError('Error al cargar las carteras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarteras();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Listado de Carteras", 14, 10);

    doc.autoTable({
      startY: 20,
      head: [["Nombre", "TEA (%)", "TCEA (%)", "Estado", "Fecha de Descuento"]],
      body: carteras.map((cartera) => [
        cartera.nombre,
        cartera.tea,
        cartera.tcea,
        cartera.estado,
        cartera.fechaDescuento.split("T")[0],
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

    doc.save("Listado_Carteras.pdf");
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            Listado de Carteras
          </h3>
          <div>
            <button
              onClick={fetchCarteras}
              className="bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150 mr-2"
            >
              Actualizar
            </button>
            <button
              onClick={exportToPDF}
              className="bg-green-500 text-green px-4 py-2 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
            >
              Exportar a PDF
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Nombre", "TEA (%)", "TCEA (%)", "Estado", "Fecha de Descuento", "Acciones"].map((header) => (
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
              {carteras.map((cartera) => (
                <tr key={cartera._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <div className="h-12 w-12 flex items-center justify-center bg-blueGray-200 rounded-full text-xl font-bold">
                      {cartera.nombre.charAt(0)}
                    </div>
                    <span
                      className={
                        "ml-3 font-bold " +
                        (color === "light" ? "text-blueGray-600" : "text-white")
                      }
                    >
                      {cartera.nombre}
                    </span>
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {cartera.tea}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {cartera.tcea}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {cartera.estado}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {cartera.fechaDescuento.split("T")[0]}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <button
                      onClick={() => history.push(`/admin/details/${cartera._id}`)}
                      className="bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
                    >
                      Detalles
                    </button>
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
