import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"
const ProtectedRoute = ({children})=>{
const accessToken = Cookies.get("accessToken")
if(!accessToken) return <Navigate to="/"/>
return children
}

export default ProtectedRoute