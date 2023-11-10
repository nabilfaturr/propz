import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 50,
    discountPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    furnished: false,
    parking: false,
    offer: false,
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (files.length >= 1 && files.length + formData.imageUrls.length <= 6) {
      setUploading(true);
      setImageUploadError(false);
      const downloadURLs = await Promise.all(
        files.map((file) => storeImage(file))
      )
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("You can only upload max 2 mb per image!");
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Go upload some file");
      setUploading(false);
    } else {
      setImageUploadError("You can only upload 6 image per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("");
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
    setImageUploadError(false);
  };

  const handleChange = (e) => {
    if (formData.type === "rent" || formData.type === "sell") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image!");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      setLoading(true);
      setError(false);

      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await response.json();

      if (data.success === "false") {
        return setError(data.message);
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-8">Create Listing</h1>
      <form
        className="m-auto w-full grid sm:grid-cols-2 sm:gap-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="name"
            placeholder="name"
            maxLength="62"
            minLength="10"
            value={formData.name}
            onChange={handleChange}
            className="border border-black/20 rounded-lg p-3"
          />
          <textarea
            type="text"
            id="description"
            placeholder="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-black/20 h-20 rounded-lg p-3 "
            required
          />
          <input
            type="text"
            id="address"
            placeholder="address"
            value={formData.address}
            onChange={handleChange}
            className="border border-black/20 rounded-lg p-3 "
            required
          />
          <div className="flex gap-5 flex-wrap my-6">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <label htmlFor="sell" className="cursor-pointer">
                Sell
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <label htmlFor="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
              />
              <label htmlFor="parking" className="cursor-pointer">
                Parking spot
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
              />
              <label htmlFor="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
              />
              <label htmlFor="offer" className="cursor-pointer">
                Offer
              </label>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                value={formData.bathrooms}
                min="1"
                max="10"
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                value={formData.regularPrice}
                min="50"
                max="10000000"
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="0"
                max="10000000"
                value={formData.discountPrice}
                onChange={handleChange}
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 my-6 sm:my-0">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              onChange={(e) => {
                const filesArray = Array.from(e.target.files);
                setFiles(filesArray);
              }}
              multiple
            />
            <button
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              type="button"
              disabled={uploading}
              onClick={handleImageUpload}
            >
              {uploading ? "UPLOADING..." : "UPLOAD"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((img, id) => {
                return (
                  <div key={id} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="object-cover w-full h-full rounded-md"
                    />
                    <button
                      className="rounded-full flex items-center justify-center font-bold text-md text-white bg-red-500 w-5 h-5 invisible group-hover:visible absolute -top-2 -right-2"
                      type="button"
                      onClick={handleDeleteImage.bind(this, id)}
                    >
                      <span>-</span>
                    </button>
                  </div>
                );
              })}
          </div>
          <button
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
            type="submit"
          >
            {loading ? "Loading..." : "Create Listing"}
          </button>
          <p className="text-red-600 text-sm font-bold">
            {imageUploadError ? `${imageUploadError}` : ""}
          </p>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
