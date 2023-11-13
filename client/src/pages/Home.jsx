import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [sellListings, setSellListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get-all-listing?offer=true&limit=4"
        );
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get-all-listing?type=rent&limit=4"
        );
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          "/api/listing/get-all-listing?type=sell&limit=4"
        );
        const data = await res.json();
        setSellListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className="max-w-6xl mx-auto">
      {/* top */}
      <div className="h-[94vh] flex flex-col justify-center items-center text-black relative -top-[46px] p-15">
        <div className="flex justify-center flex-col text-center gap-5 p-3">
          <h1 className="text-black-800 font-bold text-3xl sm:text-5xl lg:text-6xl">
            <span className="relative">Find your next perfect</span>
            <br />
            <span>
              place with{" "}
              <span
                style={{
                  background: `rgb(7,40,210)`,
                  background: `linear-gradient(294deg, rgba(7,40,250,1) 0%, rgba(54,37,98,1) 22%, rgba(184,0,255,1) 50%, rgba(255,0,172,1) 77%, rgba(248,0,255,1) 99%)`,
                }}
                className="text-white"
              >
                propz
              </span>
            </span>
          </h1>
          <div className="text-gray-700 text-xs sm:text-md lg:text-lg">
            Propz is the best place to find your next perfect place to live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to={"/search"}
            className="text-sm sm:text-md text-blue-800 font-bold hover:underline lg:text-lg"
          >
            Let's get started...
          </Link>
        </div>
      </div>

      {/* listing results for offer, sale and rent */}

      <div className="p-3">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-3">
              {offerListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-3">
              {rentListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {sellListings && sellListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sell
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sell"}
              >
                Show more places for sell
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-3">
              {sellListings.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
