// App.jsx

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Table from "./components/table/Table";
import "./App.css";
import BasicTable from "./components/datagrid/DataGridTable";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Table />} />
            <Route path="/table" element={<BasicTable />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
