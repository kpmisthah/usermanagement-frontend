import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch, RootState } from '../app/store';
import {toast} from 'react-toastify'
import '../../public/Login.css';
import { register,reset } from '../features/auth/authSlice';
import Spinner from '../components/user/Spinner';
function Register() {
 const[formData,setFormData] = useState({
    username:'',
    email:'',
    password:'',
 })
 const{username,email,password} = formData

 const navigate = useNavigate()
 const dispatch = useDispatch<AppDispatch>()

 const{user,isError,isSuccess,message,isLoading} = useSelector((state:RootState)=>state.auth)

 useEffect(()=>{
    if(isError){
        toast.error(message)
    }
    if(isSuccess || user){
        navigate('/')
    }

    dispatch(reset())
 },[user,isError,isSuccess,message,navigate,dispatch,isLoading])

 const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    }
  const [error, setError] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Add animation trigger after component mounts
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userData = {
        username,email,password
    }
    dispatch(register(userData))
  }
  if(isLoading){
    return <Spinner />
  }
  const onchange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    setFormData((prevState)=>({
        ...prevState,
        [e.target.name] : e.target.value,
    }))
  }
  return (
    <div className="form-container">
      <div className={`welcome-container ${isLoaded ? 'loaded' : ''}`}>
          <div className="welcome-animation">
            <div className="welcome-text">
              <span className="welcome-word">Create an Account</span>
            </div>
            <div className="welcome-decoration">
              <div className="decoration-line"></div>
              <div className="decoration-circle"></div>
            </div>
          </div>
        
      </div>
      
      <form className="form" onSubmit={handleSubmit}>
        {<input
          type="text"
          className="input"
          name='username'
          placeholder="Username"
          value={username}
          onChange={onchange}
        />}
        <input
          type='email'
          className='input'
          placeholder='email'
          name='email'
          value={email}
          onChange={onchange}
          />
        <div className="password-input-container">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Password"
            name='password'
            value={password}
            onChange={onchange}
          />

          <button 
            type="button" 
            className="password-toggle-btn"
            onClick={togglePasswordVisibility }
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>
        <button className="form-btn">Signup</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );

}

export default Register;
