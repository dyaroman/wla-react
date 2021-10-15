import {useCallback, useEffect, useState} from 'react';
import Loader from './components/Loader/Loader';
import Table from './components/Table/Table';

function App() {
    const [tableDataFromServer, setTableDataFromServer] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [sort, setSort] = useState({
        sortColumn: '',
        sortDirection: '',
    });
    const [filters, setFilters] = useState({
        website: '',
        template: '',
        campaignId: '',
        mainForm: '',
        altForm: '',
        owner: '',
        gtmKey: '',
        companyName: '',
        email: '',
        tags: new Set(),
    });

    useEffect(() => {
        getWebsitesData();
    }, []);

    async function getWebsitesData() {
        const dataFileURL = `${process.env.REACT_APP_WEBSITES_DATA_URL}/websites-data.json`;
        try {
            const response = await fetch(dataFileURL);
            const data = await response.json();
            setTableDataFromServer(data);
            setLoaded(true);
        } catch (e) {
            console.error(e);
        }
    }

    useCallback(() => {
        const newSort = {};
        const newFilters = {};
        const params = new URLSearchParams(window.location.search);
        params.forEach((value, key) => {
            switch (key) {
                case 'sortColumn':
                case 'sortDirection':
                    newSort[key] = value;
                    break;

                case 'website':
                case 'template':
                case 'campaignId':
                case 'mainForm':
                case 'altForm':
                case 'owner':
                case 'gtmKey':
                case 'companyName':
                case 'email':
                    newFilters[key] = value;
                    break;
                case 'tags':
                    newFilters[key] = new Set(value.split(','));
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
    }, [filters, sort]);

    return <>
        {loaded ? <Table
            tableDataFromServer={tableDataFromServer}
            sort={sort}
            setSort={setSort}
            filters={filters}
            setFilters={setFilters}
        /> : <Loader/>}
    </>
}

export default App;
