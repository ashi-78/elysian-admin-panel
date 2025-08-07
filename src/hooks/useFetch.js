import { useEffect, useState } from "react";
import API from "../axiosInstance"; // Use correct relative path

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("useFetch → Fetching from:", url);
        const res = await API.get(url);
        console.log("useFetch → Data received:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("useFetch → Fetch error:", err.message);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(url);
      console.log("useFetch → Re-fetched data:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("useFetch → Re-fetch error:", err.message);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
