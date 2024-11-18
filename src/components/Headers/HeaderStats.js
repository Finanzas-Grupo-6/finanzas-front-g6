import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import CardStats from "components/Cards/CardStats.js";
import carteraService from "../../services/carteras";

Modal.setAppElement("#root");

function CreateCarteraModal({ isOpen, onClose }) {
  const [nombre, setNombre] = useState("");
  const [tea, setTea] = useState(0);
  const [fechaDescuento, setFechaDescuento] = useState("");
  const [tasaSeleccionada, setTasaSeleccionada] = useState("TEA");
  const [valorTasa, setValorTasa] = useState("");

  const today = new Date();
  const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
    .toISOString()
    .split("T")[0];

  const calcularTEA = (tipoTasa, valor) => {
    if (tipoTasa === "TEA") {
      return valor;
    } else if (tipoTasa === "TNA") {
      const TEA_ = Math.pow(1 + valor / 100 / 360, 360) - 1;
      return TEA_ * 100;
    }
    return 0;
  };

  useEffect(() => {
    if (valorTasa) {
      const teaCalculada = calcularTEA(tasaSeleccionada, parseFloat(valorTasa));
      setTea(teaCalculada);
    }
  }, [tasaSeleccionada, valorTasa]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valida que la tasa no pase 100
    if (parseFloat(valorTasa) > 100) {
      alert("La tasa no puede ser mayor a 100.");
      return;
    }

    // Valida la fecha de descuento
    if (new Date(fechaDescuento) < today) {
      alert("La fecha de descuento no puede estar en el pasado.");
      return;
    }

    try {
      const nuevaCartera = {
        nombre,
        tea: parseFloat(tea),
        fechaDescuento: new Date(fechaDescuento),
      };
      await carteraService.createCartera(nuevaCartera);
      alert("Cartera creada exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al crear la cartera:", error);
      alert("Hubo un error al crear la cartera. Por favor, intente de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
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
      <div className="bg-white rounded-lg">
        <h3 className="text-blueGray-700 text-xl font-bold mb-4">Crear Nueva Cartera</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Nombre de la Cartera
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Ej. Cartera X"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Tipo de Tasa
            </label>
            <select
              value={tasaSeleccionada}
              onChange={(e) => setTasaSeleccionada(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            >
              <option value="TEA">TEA</option>
              <option value="TNA">TNA</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Valor de la Tasa
            </label>
            <input
              type="number"
              min="0.01"
              max="100" // Enforce maximum value of 100 for the input
              step="0.01"
              value={valorTasa}
              onChange={(e) => setValorTasa(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              placeholder="Ingrese el valor de la tasa"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              TEA Calculada (%)
            </label>
            <input
              type="text"
              value={Number(tea).toFixed(2)}
              readOnly
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            />
          </div>
          <div className="mb-4">
            <label className="block text-blueGray-600 text-xs font-bold mb-2">
              Fecha de Descuento
            </label>
            <input
              type="date"
              min={today.toISOString().split("T")[0]} // Ensure date can't be set in the past
              max={maxDate}
              value={fechaDescuento}
              onChange={(e) => setFechaDescuento(e.target.value)}
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded shadow hover:shadow-md mr-2 transition-all duration-150"
              onClick={onClose}
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
      </div>
    </Modal>
  );
}

export default function HeaderStats({ saldo_ }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      history.push("/auth/login");
    }
  }, [history, user]);

  return (
    <>
      <div className="relative bg-lightBlue-600 md:pt-5 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="USUARIOS"
                  statTitle={user ? user.userCount : 0}
                  statArrow="up"
                  statPercent="0.00"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Número total de usuarios"
                  statIconName="fas fa-users"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="SALDO"
                  statTitle={`$${parseFloat(saldo_).toFixed(2)}`}
                  statArrow="up"
                  statPercent="0.00"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Saldo actual del usuario"
                  statIconName="fas fa-wallet"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-lightBlue-500 text-white font-bold py-4 rounded shadow hover:shadow-md focus:outline-none transition-all duration-150"
                >
                  Crear Nueva Cartera
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateCarteraModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
