import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
const res = await axios.get(`/api/${path}`);
        setList(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [path]);

  const handleDelete = async (roomId, hotelId) => {
    if (!roomId || !hotelId) {
      console.error("Missing roomId or hotelId:", { roomId, hotelId });
      return;
    }

    try {
      await axios.delete(`/rooms/${roomId}/${hotelId}`);
      setList((prev) => prev.filter((item) => item._id !== roomId));
      console.log(`Deleted room ${roomId} from hotel ${hotelId}`);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const { _id, hotelId } = params.row;
        console.log("Row data:", params.row);  // Debug log

        return (
          <div className="cellAction">
            <Link to={`/api/${path}/${_id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(_id, hotelId)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
