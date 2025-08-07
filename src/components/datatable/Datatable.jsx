import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();
  const { data, loading, error } = useFetch(`/${path}`);

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get(`/${path}`);
      setList(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, [path]);

  // Token (if using protected routes)
  const handleDelete = async (roomId, hotelId) => {
  console.log(`Deleting room: ${roomId} from hotel: ${hotelId}`);
  try {
    await axios.delete(`/rooms/${roomId}/${hotelId}`);
    setList(list.filter((item) => item._id !== roomId));
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
      console.log("Room row data:", params.row);  // <-- Add this here

      return (
        <div className="cellAction">
          <Link to="/users/test" style={{ textDecoration: "none" }}>
            <div className="viewButton">View</div>
          </Link>
          <div
            className="deleteButton"
            onClick={() => handleDelete(params.row._id, params.row.hotelId)}
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
        rows={list || []}
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
