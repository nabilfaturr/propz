import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === "false") {
        setLoading(false);
        setError(data.message);
        return;
      }

      setLoading(false);
      setError(null);
      navigate("/signin");
    } catch (error) {
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-4xl my-7 font-bold text-slate-700">
        Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="username"
          id="username"
          onChange={handleChange}
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80"
          type="submit"
        >
          {loading ? "Loading..." : "SIGN UP"}
        </button>
      </form>
      <div className="flex mt-5 gap-2">
        <p className="">Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:opacity-70">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-2 text-md">{error}</p>}
    </div>
  );
};

export default SignUp;
