import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "animate.css/animate.min.css";
import AppRoutes from './routes/AppRoutes';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-center" autoClose={2000} />
    </BrowserRouter>
)
