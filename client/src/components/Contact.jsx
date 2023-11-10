import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchingData = async () => {
      const response = await fetch(`/api/user/${listing.userRef}`);
      const data = await response.json();

      setUser(data);
    };
    fetchingData();
  }, [listing.userRef]);

  return (
    <div>
      {user && (
        <div className="flex flex-col gap-3">
          <p className="text-center">
            Contact <span className="font-bold">{user.username}</span> for{" "}
            <span className="font-bold">{listing.name}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChangeMessage}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-blue-600 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 self-end font-medium"
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
};

export default Contact;

// http://localhost:5173/listing/654dceabecaadf25e3242eed
