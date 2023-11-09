import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";

import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "./../redux/user/userSlice";

import { app } from "../firebase";

const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loadingShowListing, setLoadingShowListing] = useState(false);
  const [errorShowListing, setErrorShowListing] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    if (userListing) {
      userListing.map((list, id) => console.log(list._id));
    }
  }, [userListing]);

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

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success === "false") {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
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
        dispatch(updateUserFailure(data.message));
        return;
      }

      setUpdateSuccess(true);
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "GET",
      });

      const data = await response.json();

      if (data.success === "false") {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleShowListing = async () => {
    try {
      setLoadingShowListing(true);
      setErrorShowListing(false);

      const response = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await response.json();

      if (data.success === "false") {
        return setErrorShowListing(error.message);
      }

      console.log(data);

      setLoadingShowListing(false);
      setErrorShowListing(false);
      setUserListing(data);
    } catch (error) {
      setErrorShowListing(error.message);
      setLoadingShowListing(false);
    }
  };

  const handleDeleteListing = async (listID) => {
    try {
      console.log(listID);
      const response = await fetch(`/api/listing/delete/${listID}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success === false) {
        return console.log(data.message);
      }

      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listID)
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-xl mx-auto">
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
        <Link
          className="bg-green-700 p-3 text-center text-white font-bold text-lg rounded-lg hover:bg-opacity-95 disabled:bg-opacity-70"
          type="submit"
          to={"/create-listing"}
        >
          CREATE LISTING
        </Link>
      </form>
      <div className="flex justify-between my-5">
        <span
          className="text-red-600 hover:opacity-70 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </span>
        <span
          className="text-red-600 hover:opacity-70 cursor-pointer"
          onClick={handleSignOut}
        >
          Sign Out
        </span>
      </div>
      <div className="flex flex-col">
        <p className="font-bold text-green-600">
          {updateSuccess ? "Update Successful" : ""}
        </p>
        <p className="font-bold text-red-600">{error ? error : ""}</p>
        <button
          className="px-4 py-2 border border-green-500 inline rounded-lg self-center text-green-600 hover:shadow-md"
          type="button"
          disabled={loadingShowListing}
          onClick={handleShowListing}
        >
          {loadingShowListing ? "Loading..." : "Show Listing"}
        </button>
        <p className="font-bold text-red-600">
          {errorShowListing ? errorShowListing : ""}
        </p>
      </div>
      {userListing && userListing.length > 0 && (
        <div className="mt-10">
          {userListing.map((list) => (
            <div
              key={list._id}
              className="border border-black/10 hover:shadow-md p-3 items-center flex justify-between gap-2 mb-3 rounded-lg"
            >
              <div className="flex  gap-2 items-center">
                <img
                  src={list.imageUrls[0]}
                  alt=""
                  className="w-40 object-cover h-20 rounded-lg"
                />
                <p className="font-medium text-sm">{list.name}</p>
              </div>
              <div className="flex gap-3 flex-col">
                <button className="w-16 rounded-lg text-white text-sm font-medium bg-green-700 px-2 py-1 hover:opacity-90">
                  Update
                </button>
                <button
                  className="w-16 rounded-lg text-white text-sm font-medium bg-red-700 px-2 py-1 hover:opacity-90"
                  type="button"
                  onClick={() => {
                    handleDeleteListing(list._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
