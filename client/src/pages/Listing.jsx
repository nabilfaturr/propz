import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchingData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(`/api/listing/get/${params.listingID}`);
        const data = await response.json();

        if (data.success === "false") {
          setError(true);
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
    <main className="max-w-3xl mx-auto p-3">
      {loading && (
        <p className="text-center my-7 text-2xl font-bold">Loading...</p>
      )}
      {error && (
        <p className="text-center my-7 text-2xl font-bold">
          Something went wrong...
        </p>
      )}
      {formData && formData.imageUrls && !loading && !error && (
        <div>
          <Swiper navigation>
            {formData.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px] rounded-lg"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
};

export default Listing;
