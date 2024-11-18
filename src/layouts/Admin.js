import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";

// views

import Dashboard from "views/admin/Dashboard.js";
import Tables from "views/admin/Carteras.js";
import FacturasTable from "views/admin/Facturas";
import { CarteraDetails } from "views/admin/CarteraDetails";
import { useHistory } from "react-router-dom";

export default function Admin() {
  const [saldo,setSaldo]=useState(0);
  const history = useHistory();

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('user'));

    if (!user) {
      history.push("/auth/login");
      return;
    }

    if(user){
      setSaldo(user.saldo);
    }
  },[])

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats saldo_={saldo} />

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/carteras" exact component={Tables} />
            <Route path="/admin/facturas" exact component={FacturasTable} />
            {/* Ruta con parámetro dinámico para el ID */}
            <Route 
  path="/admin/details/:id" 
  exact 
  render={(props) => (
    <CarteraDetails 
      {...props} 
      saldo={saldo} 
      setSaldo={setSaldo} 
    />
  )} 
/>
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
        </div>
      </div>
    </>
  );
}
