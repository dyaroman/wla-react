import { useEffect, useState } from "react";
import Loader from "./components/Loader/Loader";
import Table from "./components/Table/Table";
import Info from "./components/Info/Info";

function App() {
  const [websitesData, setWebsitesData] = useState();
  const [loaded, setLoaded] = useState(false);
  const [sort, setSort] = useState({
    sortColumn: "",
    sortDirection: "",
  });
  const [filters, setFilters] = useState({
    website: "",
    template: "",
    campaignId: "",
    mainForm: "",
    altForm: "",
    owner: "",
    gtmKey: "",
    companyName: "",
    email: "",
    tags: new Set(),
  });

  useEffect(() => {
    getWebsitesData();
    getURLParams();
    // eslint-disable-next-line
  }, []);

  async function getWebsitesData() {
    const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/websites-data.json`;
    try {
      const response = await fetch(dataFileURL);
      const data = await response.json();
      setWebsitesData(data);
      setLoaded(true);
    } catch (e) {
      console.error(e);
    }
  }

  function getURLParams() {
    const newSort = {};
    const newFilters = {};
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      switch (key) {
        case "sortColumn":
        case "sortDirection":
          newSort[key] = value;
          break;

        case "website":
        case "template":
        case "campaignId":
        case "mainForm":
        case "altForm":
        case "owner":
        case "gtmKey":
        case "companyName":
        case "email":
          newFilters[key] = value;
          break;
        case "tags":
          newFilters[key] = new Set(value.split(","));
          break;

        default:
          break;
      }
    });
    setSort({
      ...sort,
      ...newSort,
    });
    setFilters({
      ...filters,
      ...newFilters,
    });
  }

  return (
    <>
      {loaded ? (
        <>
          <Info
            timestamp={websitesData["timestamp"]}
            commit={websitesData["commit"]}
          />
          <Table
            data={websitesData["websites"]}
            sort={sort}
            setSort={setSort}
            filters={filters}
            setFilters={setFilters}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;
