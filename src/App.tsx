import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from "./pages/Login"
import Home from './pages/Home'
import Register from './pages/Register'
import Header from './components/user/Header'
import PrivateRoute from './components/user/PrivateRoute'
function App() {


  return (
    <>
    <BrowserRouter>
      <div className='container'>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={
          <PrivateRoute>
          <Register />
          </PrivateRoute>
          }/>
      </Routes>
      </div>  
    </BrowserRouter>
    <ToastContainer />
    </>
  )
}

export default App
