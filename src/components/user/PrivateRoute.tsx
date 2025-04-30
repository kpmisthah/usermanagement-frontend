import { JSX } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../app/store"
import { Navigate } from "react-router-dom"

interface props{
    children:JSX.Element
}
const PrivateRoute = ({children}:props) => {
    const{user} = useSelector((state:RootState)=>state.auth)
  return (
    user?children:<Navigate to='/login'/>
  )
}

export default PrivateRoute
