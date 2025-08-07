import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url, token = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setData(res.data);
    } catch (err) {
      console.error("Fetching error:", err.message);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const reFetch = () => {
    fetchData(); // reuse same function
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
