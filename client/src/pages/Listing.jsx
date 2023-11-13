import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/api/listing/get/${params.listingID}`);
        const data = await response.json();

        if (data.success === "false") {
          setError(true);
          setLoading(false);
          return console.log(data.message);
        }

        setLoading(false);
        setError(false);
        setFormData(data);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    fetchingData();
  }, [params.listingID]);

  return (
    <main className="max-w-4xl mx-auto p-3">
      {loading && (
        <p className="text-center my-7 text-2xl font-bold">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl font-bold text-red-600">
          Something went wrong...
        </p>
      )}
      {formData && formData.imageUrls && !loading && !error && (
        <div>
          <div>
            <Swiper navigation>
              {formData.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[450px] rounded-lg"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="text-lg">
            <p className="my-3">
              <span className="font-semibold">{formData.name}</span>
              <span className="mx-2">-</span>
              <span className="font-bold">
                ${+formData.regularPrice - +formData.discountPrice}/month
              </span>
            </p>
            <div className="flex my-3">
              <div className="border border-black flex items-center gap-2 p-2 rounded-lg">
                <FaMapMarkerAlt className="text-green-800" size={22} />
                <span className="font-medium">{formData.address}</span>
              </div>
            </div>
            <p className="my-5">
              <span className="font-semibold px-4 py-2 rounded-lg text-white bg-red-700 mr-3">
                {formData.type === "rent" ? "For Rent" : "For Sell"}
              </span>
              <span className="font-semibold px-4 py-2 rounded-lg text-white bg-green-700 mr-3">
                ${formData.discountPrice} Discount
              </span>
            </p>
            <p>
              <span className="font-bold">Description - </span>
              <span className="text-slate-800">{formData.description}</span>
            </p>
            <div className="text-green-800 flex justify-between my-3 text-[16px]">
              <div className="flex gap-2 items-center">
                <FaBed />
                <p className="">
                  {+formData.bathrooms > 1
                    ? `${formData.bedrooms} Beds`
                    : `${formData.bedrooms} Bed`}{" "}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <FaBath />
                <p className="">
                  {+formData.bathrooms > 1
                    ? `${formData.bathrooms} Baths`
                    : `${formData.bathrooms} Bath`}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <FaParking />
                <p className="">
                  {formData.parking ? "Parking Spot" : "No Parking"}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <FaChair />
                <p className="">
                  {formData.furnished ? "Furnished" : "Unfurnished"}
                </p>
              </div>
            </div>
          </div>
          {currentUser && formData.userRef !== currentUser._id && !contact && (
            <button
              className="text-lg bg-slate-800 w-full text-white font-semibold my-3 px-4 py-2 rounded-lg"
              type="button"
              onClick={() => setContact(true)}
            >
              Contact Landlord
            </button>
          )}
          {contact && <Contact listing={formData} />}
        </div>
      )}
    </main>
  );
};

export default Listing;
