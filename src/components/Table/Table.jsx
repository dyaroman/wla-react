import { useEffect, useState } from "react";
import {
  filterTableData,
  sortTableData,
  updateURL,
} from "../../misc/functions";
import FilterField from "../FilterField/FilterField";
import FilterTitle from "../FilterTitle/FilterTitle";
import Tags from "../Tags/Tags";
import TagsFilterField from "../TagsFilterField/TagsFilterField";

function Table({ data, sort, setSort, filters, setFilters }) {
  const [tableData, setTableData] = useState(data);

  useEffect(() => {
    updateTableData();
    updateURL({
      ...filters,
      ...sort,
    });
    // eslint-disable-next-line
  }, [filters, sort]);

  function updateTableData() {
    let updatedData = [...data];

    for (const filterKey in filters) {
      if (filters[filterKey] !== "") {
        updatedData = filterTableData(
          filterKey,
          filters[filterKey],
          updatedData
        );
      }
    }

    if (sort.sortDirection === "asc") {
      updatedData = sortTableData(updatedData, sort.sortColumn);
    } else if (sort.sortDirection === "desc") {
      updatedData = sortTableData(updatedData, sort.sortColumn).reverse();
    }

    setTableData(updatedData);
  }

  function filterFieldChangeHandler(filterName, filterValue) {
    setFilters({
      ...filters,
      [filterName]: filterValue,
    });
  }

  function sortTableHandler(e) {
    const { sortColName, sortColDirection } = e.target.dataset;
    const newSort = {};
    if (sortColName !== sort.sortColumn) {
      newSort["sortColumn"] = sortColName;
    }
    if (sortColDirection === undefined || sortColDirection === "desc") {
      newSort["sortDirection"] = "asc";
    } else {
      newSort["sortDirection"] = "desc";
    }
    setSort({
      ...sort,
      ...newSort,
    });
  }

  return (
    <table>
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
          <FilterTitle text="Tags" />
        </tr>

        <tr>
          <th />
          <th>
            <FilterField
              name={"website"}
              value={filters["website"]}
              onChange={filterFieldChangeHandler}
              placeholder={"website"}
            />
          </th>
          <th>
            <FilterField
              name={"template"}
              value={filters["template"]}
              onChange={filterFieldChangeHandler}
              placeholder={"template"}
            />
          </th>
          <th>
            <FilterField
              name={"campaignId"}
              value={filters["campaignId"]}
              onChange={filterFieldChangeHandler}
              placeholder={"campaign id"}
            />
          </th>
          <th>
            <FilterField
              name={"mainForm"}
              value={filters["mainForm"]}
              onChange={filterFieldChangeHandler}
              placeholder={"main form"}
            />
          </th>
          <th>
            <FilterField
              name={"altForm"}
              value={filters["altForm"]}
              onChange={filterFieldChangeHandler}
              placeholder={"alt form"}
            />
          </th>
          <th>
            <FilterField
              name={"owner"}
              value={filters["owner"]}
              onChange={filterFieldChangeHandler}
              placeholder={"owner"}
            />
          </th>
          <th>
            <FilterField
              name={"gtmKey"}
              value={filters["gtmKey"]}
              onChange={filterFieldChangeHandler}
              placeholder={"gtm key"}
            />
          </th>
          <th>
            <FilterField
              name={"companyName"}
              value={filters["companyName"]}
              onChange={filterFieldChangeHandler}
              placeholder={"company name"}
            />
          </th>
          <th>
            <FilterField
              name={"email"}
              value={filters["email"]}
              onChange={filterFieldChangeHandler}
              placeholder={"email"}
            />
          </th>
          <th>
            <TagsFilterField>
              <Tags
                tags={[...filters["tags"]]}
                filters={filters}
                setFilters={setFilters}
                placeholder="select tags below"
              />
            </TagsFilterField>
          </th>
        </tr>
      </thead>

      <tbody>
        {tableData.length ? (
          tableData.map((website, index) => (
            <tr key={website["folderName"]}>
              <td data-title="#">{index + 1}</td>
              <td data-title="website">
                <a
                  href={`https://${website["currentHost"]}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {website["folderName"]}
                </a>
              </td>
              <td data-title="Template">{website["template"]}</td>
              <td data-title="CampaignId">{website["campaignId"]}</td>
              <td data-title="Main Form">
                {website["MAIN_FORM"] && website["MAIN_FORM"]["NAME"]}
              </td>
              <td data-title="Alt Form">
                {website["ALT_FORM"] && website["ALT_FORM"]["NAME"]}
              </td>
              <td data-title="Owner">{website["owner"]}</td>
              <td data-title="GTM key">{website["gtmKey"]}</td>
              <td data-title="Company Name">{website["companyName"]}</td>
              <td data-title="Email">{website["email"]}</td>
              <td data-title="Tags">
                <Tags
                  tags={website["tags"]}
                  filters={filters}
                  setFilters={setFilters}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="100" align="center" style={{ gap: 0 }}>
              no data, please change your filters
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default Table;
