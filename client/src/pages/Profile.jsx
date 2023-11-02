import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto flex flex-col">
      <h1 className="text-center text-4xl my-5 font-bold text-slate-700">
        Profile
      </h1>
      <img
        src={currentUser.avatar}
        className="text-center rounded-full self-center my-5"
        alt="profile"
      />
      <form className="flex flex-col gap-4">
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="username"
          id="username"
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="email"
          id="email"
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="password"
          id="password"
        />
        <button
          className="bg-slate-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80"
          type="submit"
        >
          UPDATE
        </button>
        <div className="flex justify-between">
          <span className="text-red-600 hover:opacity-70 cursor-pointer">
            Delete Account
          </span>
          <span className="text-red-600 hover:opacity-70 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
