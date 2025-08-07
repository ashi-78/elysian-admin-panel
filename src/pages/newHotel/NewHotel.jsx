// ✅ Final refactored version of your NewHotel component with API and debug logs
import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { hotelInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import API from "../../axiosInstance";

const NewHotel = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [info, setInfo] = useState({});
  const [rooms, setRooms] = useState([]);

  const { data, loading } = useFetch("/rooms");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setRooms(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const photoUrls = await Promise.all(
        Object.values(files).map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "upload");

          const uploadRes = await API.post(
            "https://api.cloudinary.com/v1_1/ashikashyap/image/upload",
            formData
          );

          return uploadRes.data.url;
        })
      );

      const newHotel = {
        ...info,
        rooms,
        photos: photoUrls,
      };

      console.log("🟡 Creating hotel with:", newHotel);

      await API.post("/hotels", newHotel);
      console.log("✅ Hotel created successfully");
      navigate("/hotels");
    } catch (err) {
      console.error("❌ Error creating hotel:", err.response?.data || err.message);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length > 0
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Preview"
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>

              <div className="formInput">
                <label>About Rooms</label>
                <textarea
                  id="aboutrooms"
                  onChange={handleChange}
                  placeholder="Describe the rooms..."
                  rows={5}
                  style={{ width: "100%", padding: "10px" }}
                />
              </div>

              <div className="formInput">
                <label>About Area</label>
                <textarea
                  id="aboutarea"
                  onChange={handleChange}
                  placeholder="Describe the area..."
                  rows={5}
                  style={{ width: "100%", padding: "10px" }}
                />
              </div>

              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect}>
                  {loading
                    ? "loading"
                    : data &&
                      data.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.title}
                        </option>
                      ))}
                </select>
              </div>

              <button onClick={handleClick}>Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
