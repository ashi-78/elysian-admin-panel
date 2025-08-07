import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer YOUR_JWT_TOKEN_HERE`, // Replace with your token
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Fetching error:", err.message);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    setError(null); // Reset error state before re-fetching
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer useEffect(() => {
  fetch("/api/test")
    .then((res) => res.text())
    .then((data) => console.log(data))
    .catch((err) => console.error("Proxy test failed:", err));
}, []);
`, // Replace with your token
        },
      });
      setData(res.data);
    } catch (err) {
      console.error("Re-fetching error:", err.message);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
