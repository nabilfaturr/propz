import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingCard = ({ key, listing }) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          className="h-[320px] sm:h-[200px] w-full object-cover hover:scale-105 transition-scale duration-200"
        />
        <div className="flex flex-col p-3 gap-3">
          <p className="truncate text-slate-800 font-semibold">
            {listing.name}
          </p>
          <div className="flex flex-col gap-2">
            <p className="flex items-center text-sm gap-1">
              <MdLocationOn size={23} className="text-green-700" />
              <span className="text-slate-800 line-clamp-1">
                {listing.address}
              </span>
            </p>
            <p className="h-[44px] flex-grow">
              <span className="line-clamp-2 text-gray-600 text-sm">
                {listing.description}
              </span>
            </p>
            <p className="font-bold text-green-800">
              ${listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex gap-5 text-xs font-medium text-slate-600">
              <span>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </span>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
