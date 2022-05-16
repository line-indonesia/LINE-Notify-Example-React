import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Page1 from './page1';
import reportWebVitals from './reportWebVitals';
// import { BrowserRouter, Route } from 'react-router-dom';
import { Route, Routes } from "react-router";
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Callback1 from './callback1';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/page1" element={<Page1/>} /> 
        <Route path="/callback01" element={<Callback1/>} />                 
        <Route path="*" element={<Page1/>} />
      

      </Routes>
    </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
