import './App.css';
import AuthForm from './pages/AuthForm';
import { Routes, Route } from 'react-router-dom';
import PrivateRouteWrapper from './components/PrivateRouteWrapper';
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from 'react';
import PDFChat from './pages/PDFChat';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Documents from './pages/Documents';

function App() {

  const handleClick = () => {
    toast.dismiss();
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/auth" element={<AuthForm />} />
        <Route element={<PrivateRouteWrapper />}>
          <Route path='/chat/:documentId' element={<PDFChat />} />
          <Route path='/documents' element={<Documents />} />
        </Route>
      </Routes>
      <Toaster
        toastOptions={{
          position: "top-right",
          duration: 3000,
          success: {
            style: {
              background: "#54D62C",
              color: "black",
            },
          },
          error: {
            style: {
              background: "#FF4842",
              color: "white",
              fontWeight: "600",
            },
          },
        }}
      />
    </>
  );
}

export default App;
