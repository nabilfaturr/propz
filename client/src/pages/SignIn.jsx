import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import Oauth from "../components/Oauth";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate(null);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === "false") {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-4xl my-7 font-bold text-slate-700">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="border border-black/20 rounded-lg p-3"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80"
          type="submit"
        >
          {loading ? "Loading..." : "SIGN IN"}
        </button>
        <Oauth />
      </form>
      <div className="flex mt-5 gap-2">
        <p className="">Dont Have an account?</p>
        <Link to={"/signup"}>
          <span className="text-blue-700 hover:opacity-70">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-600 mt-2 text-md">{error}</p>}
    </div>
  );
};

export default SignIn;
