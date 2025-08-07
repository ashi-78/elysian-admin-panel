import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import API from "../../axiosInstance";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const [list, setList] = useState([]);

  console.log("Datatable → Current path:", path);

  const { data, loading, error } = useFetch(`/${path}`);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const filtered = data.filter((item) => item && item._id); // ✅ filter valid rows
      console.log("Datatable → Filtered data with valid _id:", filtered);
      setList(filtered);
    } else {
      console.warn("Datatable → Data is not an array or empty:", data);
      setList([]);
    }
  }, [data]);

  const handleDelete = async (roomId, hotelId) => {
    console.log(`Datatable → Deleting room: ${roomId} from hotel: ${hotelId}`);
    try {
      await API.delete(`/rooms/${roomId}/${hotelId}`);
      setList((prevList) => prevList.filter((item) => item._id !== roomId));
    } catch (err) {
      console.error("Datatable → Delete failed:", err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        console.log("Datatable → Row data:", params.row);
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
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id} // ✅ tells MUI to use _id as unique id
        loading={loading}
      />
    </div>
  );
};

export default Datatable;
