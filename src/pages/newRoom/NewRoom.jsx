import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useContext } from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import API from "../../axiosInstance";
import { AuthContext } from "../../context/AuthContext";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState("");
  const { user } = useContext(AuthContext); // Get logged-in user with token

  const { data, loading, error } = useFetch("/hotels");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room.trim() }));
    try {
      await API.post(
        `/rooms/${hotelId}`,
        { ...info, roomNumbers },
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Send token to backend
          },
        }
      );
      alert("Room created successfully ✅");
    } catch (err) {
      console.log("user context =>", user);
      console.error("❌ Room creation error:", err.response?.data || err.message);
      alert("Failed to create room ❌");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Rooms</label>
                <textarea
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Enter comma-separated room numbers"
                />
              </div>

              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={(e) => setHotelId(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a hotel
                  </option>
                  {loading
                    ? <option>Loading hotels...</option>
                    : data?.map((hotel) => (
                        <option key={hotel._id} value={hotel._id}>
                          {hotel.name}
                        </option>
                      ))}
                </select>
              </div>

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
