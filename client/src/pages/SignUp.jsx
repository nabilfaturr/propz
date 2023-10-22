import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-4xl my-7 font-bold text-slate-700">
        Sign Up
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="username"
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="email"
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="password"
        />
        <button className="bg-slate-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80">
          SIGN UP
        </button>
      </form>
      <div className="flex mt-5 gap-2">
        <p className="">Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700 hover:opacity-70">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
