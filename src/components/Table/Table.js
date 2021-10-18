import {useEffect, useState} from 'react';
import {NO_DATA} from '../../misc/constants';
import {search, updateURL} from '../../misc/functions';
import FilterField from '../FilterField/FilterField';
import FilterTitle from '../FilterTitle/FilterTitle';
import MobileFieldTitle from '../MobileFieldTitle/MobileFieldTitle';

function Table({data, sort, setSort, filters, setFilters}) {
    const [tableData, setTableData] = useState(data);

    useEffect(() => {
        updateTableData();
        updateURL({
            ...filters,
            ...sort,
        });
    }, [
        filters,
        sort,
    ]);

    function filterTableData(filterBy, filterValue, websites) {
        return websites.filter(website => {
            switch (filterBy) {
                case 'website':
                    return website.folderName && search(website.folderName, filterValue);
                case 'mainForm':
                    return website.MAIN_FORM && search(website.MAIN_FORM.NAME, filterValue);
                case 'altForm':
                    return website.ALT_FORM && search(website.ALT_FORM.NAME, filterValue);
                case 'tags':
                    return [...filterValue].every(
                        filterTag => website.tags
                            .map(tag => tag.toLowerCase())
                            .includes(filterTag.toLowerCase())
                    );
                case 'owner':
                case 'companyName':
                case 'email':
                case 'campaignId':
                case 'template':
                case 'gtmKey':
                    return website[filterBy] && search(website[filterBy], filterValue);
                default:
                    return website;
            }
        });
    }

    function sortTableData(array) {
        const noDataItems = [];
        const sortedArray = [...array]
            .filter(item => {
                switch (sort.sortColumn) {
                    case 'mainForm':
                        if (item.MAIN_FORM && item.MAIN_FORM.NAME === NO_DATA) {
                            noDataItems.push(item);
                            return false;
                        } else {
                            return true;
                        }
                    case 'altForm':
                        if (item.ALT_FORM && item.ALT_FORM.NAME === NO_DATA) {
                            noDataItems.push(item);
                            return false;
                        } else {
                            return true;
                        }
                    case 'template':
                    case 'campaignId':
                    case 'owner':
                    case 'gtmKey':
                    case 'companyName':
                    case 'email':
                        if (item[sort.sortColumn] === NO_DATA) {
                            noDataItems.push(item);
                            return false;
                        } else {
                            return true;
                        }
                    default:
                        return true;
                }
            })
            .sort((a, b) => {
                switch (sort.sortColumn) {
                    case 'mainForm':
                        let aValue = a.MAIN_FORM && a.MAIN_FORM.NAME;
                        let bValue = b.MAIN_FORM && b.MAIN_FORM.NAME;
                        return String(aValue).toLowerCase() > String(bValue).toLowerCase() ? 1 : -1;
                    case 'altForm': {
                        let aValue = a.ALT_FORM && a.ALT_FORM.NAME;
                        let bValue = b.ALT_FORM && b.ALT_FORM.NAME;
                        return String(aValue).toLowerCase() > String(bValue).toLowerCase() ? 1 : -1;
                    }
                    case 'website':
                        return String(a.folderName).toLowerCase() > String(b.folderName).toLowerCase() ? 1 : -1;
                    case 'campaignId':
                        return Number(a[sort.sortColumn]) > Number(b[sort.sortColumn]) ? 1 : -1;
                    case 'owner':
                    case 'companyName':
                    case 'email':
                    case 'template':
                    case 'gtmKey':
                        return String(a[sort.sortColumn]).toLowerCase() > String(b[sort.sortColumn]).toLowerCase() ? 1 : -1;
                    default:
                        return 0;
                }
            });

        return [...sortedArray, ...noDataItems];
    }

    function updateTableData() {
        let updatedData = [...tableData];

        for (const filterKey in filters) {
            if (filters[filterKey] !== '') {
                updatedData = filterTableData(filterKey, filters[filterKey], updatedData);
            }
        }

        if (sort.sortDirection === 'asc') {
            updatedData = sortTableData(updatedData);
        } else if (sort.sortDirection === 'desc') {
            updatedData = sortTableData(updatedData).reverse();
        }

        return setTableData(updatedData);
    }

    function filterFieldChangeHandler(filterName, filterValue) {
        setFilters({
            ...filters,
            [filterName]: filterValue,
        });
    }

    function sortTableHandler(e) {
        const {sortColName, sortColDirection} = e.target.dataset;
        const newSort = {};
        if (sortColName !== sort.sortColumn) {
            newSort['sortColumn'] = sortColName;
        }
        if (sortColDirection === undefined || sortColDirection === 'desc') {
            newSort['sortDirection'] = 'asc';
        } else {
            newSort['sortDirection'] = 'desc';
        }
        setSort({
            ...sort,
            ...newSort,
        });
    }

    function TagsFilterField() {
        return (<>
            <MobileFieldTitle text="tags"/>
            <div className="tags-filter">
                <Tags tags={[...filters.tags]} placeholder="select tags below"/>
            </div>
        </>);
    }

    function Tags({tags, placeholder = NO_DATA}) {
        function tagClickHandler(e) {
            const newTags = filters.tags;
            const currentTag = e.target.innerText;
            if (newTags.has(currentTag)) {
                newTags.delete(currentTag);
            } else {
                newTags.add(currentTag);
            }
            setFilters({
                ...filters,
                ...newTags,
            });
        }

        if (Array.isArray(tags) && tags.length > 0) {
            const list = tags.sort().map((tag) => {
                const tagActive = [...filters.tags]
                    .map(tag => tag.toLowerCase())
                    .includes(tag.toLowerCase()) ? '' : null;
                return (<li key={tag}>
                    <button
                        className="tags__btn"
                        data-tag-active={tagActive}
                        onClick={tagClickHandler}
                    >{tag}</button>
                </li>);
            });
            return (<ul className="tags">{list}</ul>);
        } else {
            return placeholder;
        }
    }

    return <table>
        <thead>
        <tr>
            <th>#</th>
            <FilterTitle
                text="Website"
                columnName="website"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Template"
                columnName="template"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="CampaignId"
                columnName="campaignId"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Main Form"
                columnName="mainForm"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Alt Form"
                columnName="altForm"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Owner"
                columnName="owner"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="GTM key"
                columnName="gtmKey"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Company Name"
                columnName="companyName"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle
                text="Email"
                columnName="email"
                sort={sort}
                onClickHandler={sortTableHandler}
            />
            <FilterTitle text="Tags"/>
        </tr>

        <tr>
            <th/>
            <th>
                <FilterField
                    name={'website'}
                    value={filters['website']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'website'}
                />
            </th>
            <th>
                <FilterField
                    name={'template'}
                    value={filters['template']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'template'}
                />
            </th>
            <th>
                <FilterField
                    name={'campaignId'}
                    value={filters['campaignId']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'campaign id'}
                />
            </th>
            <th>
                <FilterField
                    name={'mainForm'}
                    value={filters['mainForm']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'main form'}
                />
            </th>
            <th>
                <FilterField
                    name={'altForm'}
                    value={filters['altForm']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'alt form'}
                />
            </th>
            <th>
                <FilterField
                    name={'owner'}
                    value={filters['owner']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'owner'}
                />
            </th>
            <th>
                <FilterField
                    name={'gtmKey'}
                    value={filters['gtmKey']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'gtm key'}
                />
            </th>
            <th>
                <FilterField
                    name={'companyName'}
                    value={filters['companyName']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'company name'}
                />
            </th>
            <th>
                <FilterField
                    name={'email'}
                    value={filters['email']}
                    onChange={filterFieldChangeHandler}
                    placeholder={'email'}
                />
            </th>
            <th>
                <TagsFilterField/>
            </th>
        </tr>
        </thead>

        <tbody>
        {tableData.length ? tableData
            .map((website, index) => <tr key={website.folderName}>
                <td data-title="#">{index + 1}</td>
                <td data-title="website">
                    <a
                        href={'https://' + website.currentHost}
                        target="_blank"
                        rel="noreferrer"
                    >{website.folderName}</a>
                </td>
                <td data-title="Template">{website.template}</td>
                <td data-title="CampaignId">{website.campaignId}</td>
                <td data-title="Main Form">{website.MAIN_FORM && website.MAIN_FORM.NAME}</td>
                <td data-title="Alt Form">{website.ALT_FORM && website.ALT_FORM.NAME}</td>
                <td data-title="Owner">{website.owner}</td>
                <td data-title="GTM key">{website.gtmKey}</td>
                <td data-title="Company Name">{website.companyName}</td>
                <td data-title="Email">{website.email}</td>
                <td data-title="Tags"><Tags tags={website.tags}/></td>
            </tr>) : <tr>
            <td colSpan="100" align="center" style={{gap: 0}}>no data, please change your filters</td>
        </tr>}
        </tbody>
    </table>;
}

export default Table;