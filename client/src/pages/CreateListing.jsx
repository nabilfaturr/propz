import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../firebase";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    uploadedImage: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    if (
      files.length >= 1 &&
      files.length + formData.uploadedImage.length <= 6
    ) {
      setUploading(true);
      setImageUploadError(false);
      const downloadURLs = await Promise.all(
        files.map((file) => storeImage(file))
      )
        .then((url) => {
          setFormData({
            ...formData,
            uploadedImage: formData.uploadedImage.concat(url),
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
      console.log("im here!");
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
      uploadedImage: formData.uploadedImage.filter((_, i) => i !== index),
    });
    setImageUploadError(false)
  };

  return (
    <main className="max-w-6xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-8">Create Listing</h1>
      <form className="m-auto w-full grid sm:grid-cols-2 sm:gap-5">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            id="name"
            placeholder="name"
            maxLength="62"
            minLength="10"
            className="border border-black/20 rounded-lg p-3"
          />
          <textarea
            type="text"
            id="description"
            placeholder="description"
            className="border border-black/20 h-20 rounded-lg p-3 "
            required
          />
          <input
            type="text"
            id="address"
            placeholder="address"
            className="border border-black/20 rounded-lg p-3 "
            required
          />
          <div className="flex gap-5 flex-wrap my-6">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <label htmlFor="sell" className="cursor-pointer">
                Sell
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <label htmlFor="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <label htmlFor="parking" className="cursor-pointer">
                Parking spot
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <label htmlFor="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
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
                min="1"
                max="10"
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
            {formData.uploadedImage.length > 0 &&
              formData.uploadedImage.map((img, id) => {
                return (
                  <div key={id} className="relative group">
                    <img
                      src={img}
                      alt=""
                      className="object-cover w-full h-full rounded-md"
                    />
                    <button
                      className="rounded-full items-center justify-center font-bold text-lg text-white bg-red-500 w-7 h-7 invisible group-hover:visible absolute -top-2 -right-2"
                      type="button"
                      onClick={handleDeleteImage.bind(this, id)}
                    >
                      <span>-</span>
                    </button>
                  </div>
                );
              })}
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
          <p className="text-red-600 text-sm font-bold">
            {imageUploadError ? `${imageUploadError}` : ""}
          </p>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
