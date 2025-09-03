// src/Login.jsx
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Email: ${email} \nPassword: ${password} \nRemember: ${remember}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl hover:shadow-3xl transition-shadow rounded-3xl p-12 w-[400px] md:w-[450px] lg:w-[500px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png"
            alt="Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:shadow-md text-gray-800 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-4 left-4 text-gray-400 w-5 h-5" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:shadow-md text-gray-800 transition-all"
              required
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="accent-gray-800"
              />
              <span>Remember me</span>
            </label>
            <a href="/forgot" className="hover:underline text-gray-800">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all font-semibold shadow-lg transform hover:scale-105"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-800 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
