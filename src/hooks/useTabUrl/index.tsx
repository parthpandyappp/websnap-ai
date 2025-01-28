import { useEffect, useState } from "react";
import {
  fetchActiveTabUrl,
  listenForUrlUpdates,
} from "../../services/chrome-services";

const useTabUrl = () => {
  const [url, setUrl] = useState<string | null>("No URL found.");

  useEffect(() => {
    // Fetch the active tab's URL
    const fetchUrl = async () => {
      const activeTabUrl = await fetchActiveTabUrl();
      setUrl(activeTabUrl || "No URL found.");
    };

    fetchUrl();

    // Listen for URL updates
    const removeListener = listenForUrlUpdates(setUrl);

    // Cleanup listener on unmount
    return removeListener;
  }, []);

  return url;
};

export default useTabUrl;
