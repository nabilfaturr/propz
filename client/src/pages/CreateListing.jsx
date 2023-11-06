import React from "react";

const CreateListing = () => {
  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl font-bold text-center my-5">Create Listing</h1>
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
              <label for="sell" className="cursor-pointer">
                Sell
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <label for="rent" className="cursor-pointer">
                Rent
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <label for="parking" className="cursor-pointer">
                Parking spot
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <label for="furnished" className="cursor-pointer">
                Furnished
              </label>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <label for="offer" className="cursor-pointer">
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
        <div className="flex flex-col flex-1 gap-4 my-6">
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
              multiple
            />
            <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">
              Upload
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
