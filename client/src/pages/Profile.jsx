import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  signInFailure,
  signInSuccess,
} from "./../redux/user/userSlice";

import { app } from "../firebase";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshoot) => {
        setfileUploadError(false);
        const progress = parseInt(
          (snapshoot.bytesTransferred / snapshoot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      (error) => setfileUploadError(true),
      () => {
        console.log(uploadTask.snapshot);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success === "false") {
        console.log("iya maaf aku salahh");
        dispatch(updateUserFailure(data.message));
        return;
      }

      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-4xl my-5 font-bold text-slate-700">
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmitForm}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          className="text-center w-32 h-32  rounded-full self-center my-5"
          alt="profile"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <p className="text-md self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload! (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          onChange={handleChange}
        />
        <input
          type="text"
          className="border border-black/20 rounded-lg p-3 bg-transparent"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          className="bg-slate-700 p-3 text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-80"
          type="submit"
        >
          {loading ? "LOADING..." : "UPDATE"}
        </button>
      </form>
      <div className="flex justify-between my-5">
        <span className="text-red-600 hover:opacity-70 cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-600 hover:opacity-70 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="font-bold text-green-600">
        {updateSuccess ? "Update Successful" : ""}
      </p>
      <p className="font-bold text-red-600">{error ? error : ""}</p>
    </div>
  );
};

export default Profile;
