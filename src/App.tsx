import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { Login } from './pages/Guest/Login';
import Private from './pages/Private';
import Usuario from './pages/Private/Usuario';
import Guest from './pages/Guest';
import { Register } from './pages/Guest/Register';


export interface ErrorResponse {
  response?: {
    data?: {
      message: string,
      statusCode: string
    }
  }
}


function App() {

  return (
    <>


      <Toaster
        position="bottom-left"
        reverseOrder={false}
        toastOptions={{
          duration: 5000, // Duração padrão de 5 segundos
        }}
      />
      <Routes>

        <Route path="/" element={<Guest />}>
          <Route index element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route path="/usuario" element={<Private />}>
          <Route index element={<Usuario />} />
        </Route>


      </Routes>
    </>

  )
}

export default App
