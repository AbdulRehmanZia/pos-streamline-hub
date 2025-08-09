
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../Instance/BaseUrl";

const Login = ({setIsAdminLoggedIn} ) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({

    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await api.post("user/login", formData , { withCredentials: true }); // backend ko token yahan se milega cookie me se
      const res_data = await response.data;
      console.log("response from server", res_data);



      // Redirect to dashboard after successful login
      setIsAdminLoggedIn(true);
      navigate("/");

    } catch (error) {
      const errMsg =
        error.response?.data?.message || "Something went wrong!";
      setMessage({ type: "error", text: errMsg });
    }
    // localStorage.setItem('isAdminLoggedIn', 'true');

  };


  return (
    <div className="max-w-md mx-auto p-6 border rounded-[10px] flex flex-col items-center justify-center mt-[150px] bg-white shadow">
      <p className="text-[30px] font-bold ">Login</p>
      {message && (
        <p
          className={`mb-4 ${message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 ">


        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-[10px] !mt-6"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-[10px] !mt-6"
        />

      
        <span className="text-blue-500 cursor-pointer flex justify-end mt-2" 
        onClick={() => navigate('/forgetpassword')}>
          Forget Password?
        </span>

      

        <button
          type="submit"
          className="w-full bg-[#155dfc] !text-white py-2 rounded-[10px] hover:bg-blue-700 !mt-7 font-bold"
        >
          Login
        </button>

      </form>
    </div>
  );
};

export default Login;