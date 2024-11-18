import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import carteraService from "../../services/carteras";
import facturaService from "../../services/facturas";
import CardTable from "components/Cards/CardTableFacturasDesdeCartera";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-modal";

Modal.setAppElement("#root");

export const CarteraDetails = ({ saldo, setSaldo }) => {
  const { id } = useParams();
  const history = useHistory();

  const [cartera, setCartera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [cliente, setCliente] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [monto, setMonto] = useState("");
  const [moneda, setMoneda] = useState("USD");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [datosRecibirHoy, setDatosRecibirHoy] = useState(null);

  // Calcular la fecha máxima permitida (un año desde hoy)
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() + 1,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split("T")[0];

  // Función para obtener la información de la cartera
  const fetchCartera = async () => {
    try {
      setLoading(true);
      const carteraData = await carteraService.getCarteraById(id);
      setCartera(carteraData);

      try {
        const datosHoy = await carteraService.calcularMontoRecibirHoy(id);
        setDatosRecibirHoy(datosHoy);
      } catch (error) {
        if (error.response?.status === 404) {
          console.warn("No hay datos para recibir hoy.");
        } else {
          console.error("Error al calcular monto recibir hoy:", error);
        }
        setDatosRecibirHoy(null);
      }

      setLoading(false);
    } catch (err) {
      setError("Error al cargar los detalles de la cartera");
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartera();
  }, [id]);

  // Función para actualizar el saldo
  const handleRecibirDinero = async (e) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const data = await carteraService.recibirSaldoYActualizarCartera(
        user._id,
        cartera._id
      );
      setSaldo(data.saldoActualizado);
      alert(`Saldo actualizado: ${data.saldoActualizado}`);
      history.push("/admin/carteras");
    } catch (error) {
      console.error("Error al recibir dinero:", error);
    }
  };

  // Función para crear una nueva factura
  const handleCreateFactura = async (e) => {
    e.preventDefault();

    // Validación de valores positivos
    if (parseFloat(monto) <= 0) {
      alert("El monto debe ser un valor positivo.");
      return;
    }

    try {
      let facturaMonto = parseFloat(monto);
      let facturaMoneda = moneda;

      if (moneda === "USD") {
        facturaMonto *= 3.7;
        facturaMoneda = "PEN";
      }

      const nuevaFactura = {
        cliente,
        numeroFactura,
        monto: facturaMonto,
        moneda: facturaMoneda,
        fechaVencimiento,
        carteraId: cartera._id,
      };

      await facturaService.createFactura(nuevaFactura);
      alert("Factura creada exitosamente");
      setIsModalOpen(false);

      // Llamar a fetchCartera para obtener la lista actualizada de facturas
      await fetchCartera();
    } catch (error) {
      console.error("Error al crear la factura:", error);
      alert("Hubo un error al crear la factura. Por favor, intente de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500 animate-pulse">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!cartera) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">
          No se encontraron detalles para esta cartera.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 rounded-lg shadow-lg mt-10">
        <div className="px-6 py-6 border-b border-gray-200 flex items-center">
          <FontAwesomeIcon
            icon={faFolderOpen}
            className="text-4xl text-lightBlue-500 mr-4"
          />
          <h1 className="text-4xl font-bold text-blueGray-700">
            Detalles de la Cartera
          </h1>
        </div>
        <div className="px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center mb-4">
              <p className="text-xl">
                <span className="font-semibold text-blueGray-600">Nombre:</span>{" "}
                {cartera.nombre}
              </p>
            </div>
            <div className="flex items-center mb-4">
              <p className="text-xl">
                <span className="font-semibold text-blueGray-600">TEA:</span>{" "}
                {cartera.tea}%
              </p>
            </div>
          </div>
          {cartera.estado === "activa" && (
            <>
              {" "}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md mt-4"
              >
                Crear Nueva Factura
              </button>
              <button
                onClick={handleRecibirDinero}
                className="bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md m-1 mt-2"
              >
                Recibir Dinero hoy
              </button>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <CardTable facturas={cartera.facturas} />
  {/* Mostrar tabla solo si `datosRecibirHoy` tiene datos */}
        {datosRecibirHoy?.resumenFacturas?.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <h2 className="text-xl font-bold text-blueGray-700 mb-4">
              Facturas Detalladas
            </h2>
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    {[
                      "Número Factura",
                      "Monto Original",
                      "Fecha Vencimiento",
                      "Días Restantes",
                      "Tasa Descontada (%)",
                      "Monto Descontado",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {datosRecibirHoy.resumenFacturas.map((factura) => (
                    <tr key={factura.id}>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {factura.numeroFactura}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        S/ {factura.montoOriginal}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {factura.fechaVencimiento}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {factura.diasRestantes}
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        {(factura.tasaDescontada * 100).toFixed(2)}%
                      </td>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        S/ {factura.montoDescontado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Modal para crear nueva factura */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            width: "400px",
            borderRadius: "10px",
            boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          },
        }}
      >
        <h3 className="text-blueGray-700 text-xl font-bold mb-4">
          Crear Nueva Factura
        </h3>
        <form onSubmit={handleCreateFactura}>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Cliente
            </label>
            <input
              type="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Número de Factura
            </label>
            <input
              type="text"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Monto
            </label>
            <input
              type="number"
              min="0" // Evita valores negativos en el input
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Moneda
            </label>
            <select
              value={moneda}
              onChange={(e) => setMoneda(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            >
              <option value="USD">USD</option>
              <option value="PEN">PEN</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Fecha de Vencimiento
            </label>
            <input
              type="date"
              max={maxDate} // Restringe la fecha máxima a un año desde hoy
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:shadow-md mr-2 transition-all duration-150"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-lightBlue-500 text-white px-4 py-2 rounded shadow hover:shadow-md transition-all duration-150"
            >
              Crear
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
