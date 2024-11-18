import React, { useEffect, useState } from "react";
import carteraService from "../../services/carteras";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function CardPageVisits() {
  const [carteras, setCarteras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarteras = async () => {
      try {
        const data = await carteraService.getCarterasConMontos();
        setCarteras(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCarteras();
  }, []);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Carteras y Montos Totales", 14, 10);
  
    // Configuración de la tabla con colores personalizados
    doc.autoTable({
      startY: 20,
      head: [["Nombre de la Cartera", "Monto Total"]],
      body: carteras.map((cartera) => [cartera.nombre, cartera.montoTotal]),
      theme: "grid",
      headStyles: {
        fillColor: [30, 144, 255], // Color de fondo de la cabecera (azul)
        textColor: [255, 255, 255], // Color del texto de la cabecera (blanco)
        fontStyle: "bold", // Estilo del texto
      },
      bodyStyles: {
        fillColor: [240, 248, 255], // Color de fondo de las filas (azul claro)
        textColor: [0, 0, 0], // Color del texto de las filas (negro)
      },
      alternateRowStyles: {
        fillColor: [224, 238, 255],
      },
      styles: {
        font: "helvetica", // Tipo de fuente
        fontSize: 10, // Tamaño de la fuente
      },
    });
  
    doc.save("Carteras_Montos.pdf");
  };
  

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Carteras y Montos Totales
              </h3>
            </div>
            <div className="text-blueGray-50 relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <button
                onClick={exportPDF}
                className="border-1 text-blue-700 h:text-blue-600"
              >
                Exportar a PDF
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Nombre de la Cartera
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Monto Total
                </th>
              </tr>
            </thead>
            <tbody>
              {carteras.map((cartera) => (
                <tr key={cartera._id}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {cartera.nombre}
                  </th>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {cartera.montoTotal}
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
