import React from "react";

// components

import CardTable from "components/Cards/CardTableFacturas";

export default function FacturasTable() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardTable color="dark" />
        </div>
      </div>
    </>
  );
}
