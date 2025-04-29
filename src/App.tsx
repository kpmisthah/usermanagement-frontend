import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from "./pages/Login"
import Home from './pages/Home'
import Register from './pages/Register'
import Header from './components/user/Header'
function App() {


  return (
    <>
    <BrowserRouter>
      <div className='container'>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register />}/>
      </Routes>
      </div>
      
    </BrowserRouter>
    </>
  )
}

export default App
