import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";

const Header = () => {

  const {currentUser} = useSelector(state => state.user);

  return (
    <header className="bg-slate-200 mx-auto shadow-md">
      <div className="flex justify-between items-center mx-auto px-3 py-5 gap-3 max-w-[1200px]">
        <Link to={"./"}>
          <h1 className="text-lg xs:text-xl font-extrabold sm:text-2xl text-blue-900 cursor-pointer">
            propertX
          </h1>
        </Link>
        <form className="flex items-center px-4 bg-white rounded-lg">
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent focus:outline-none rounded-xl py-2 w-32 xs:w-56 sm:w-64 md:w-80 lg:w-[36rem]"
          />
          <FaSearch className="text-slate-700" size={20} />
        </form>
        <div className="flex sm:gap-8 items-center">
          <Link to={"./profile"}>
          {currentUser ? (
            <img src={currentUser.avatar} alt="" className="object-cover w-10 h-10 rounded-full"/>
          ) : (
            <h1 className="hidden sm:inline-block text-slate-700 sm:text-lg hover:underline cursor-pointer">
              Sign In
            </h1>
          )}
          </Link>
          <Link to={"./about"}>
            <h1 className="hidden sm:inline-block text-slate-700 sm:text-lg hover:underline cursor-pointer">
              About
            </h1>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
