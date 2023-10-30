import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result.user.photoURL);

      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await response.json();

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could'nt sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80"
    >
      Continue with Google
    </button>
  );
};

export default Oauth;
