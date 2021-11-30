import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from '../FilterField/FilterField';
import { FilterTitle } from '../FilterTitle/FilterTitle';
import { Tags } from '../Tags/Tags';
import { TagsFilterField } from '../TagsFilterField/TagsFilterField';
import { updateTableData } from '../../features/table/table.actions';
import { updateURL } from '../../misc/functions';

export function Table() {
  const dispatch = useDispatch();
  const { sort, filters, preparedData } = useSelector(
    (state) => state['table']
  );

  useEffect(() => {
    dispatch(updateTableData());
    updateURL({
      ...filters,
      ...sort,
    });
  }, [dispatch, filters, sort]);

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <FilterTitle text="Website" columnName="website" />
          <FilterTitle text="Template" columnName="template" />
          <FilterTitle text="CampaignId" columnName="campaignId" />
          <FilterTitle text="Main Form" columnName="mainForm" />
          <FilterTitle text="Alt Form" columnName="altForm" />
          <FilterTitle text="Owner" columnName="owner" />
          <FilterTitle text="GTM key" columnName="gtmKey" />
          <FilterTitle text="Company Name" columnName="companyName" />
          <FilterTitle text="Email" columnName="email" />
          <th>Tags</th>
        </tr>

        <tr>
          <th>{preparedData.length}</th>
          <th>
            <FilterField name={'website'} placeholder={'website'} />
          </th>
          <th>
            <FilterField name={'template'} placeholder={'template'} />
          </th>
          <th>
            <FilterField name={'campaignId'} placeholder={'campaign id'} />
          </th>
          <th>
            <FilterField name={'mainForm'} placeholder={'main form'} />
          </th>
          <th>
            <FilterField name={'altForm'} placeholder={'alt form'} />
          </th>
          <th>
            <FilterField name={'owner'} placeholder={'owner'} />
          </th>
          <th>
            <FilterField name={'gtmKey'} placeholder={'gtm key'} />
          </th>
          <th>
            <FilterField name={'companyName'} placeholder={'company name'} />
          </th>
          <th>
            <FilterField name={'email'} placeholder={'email'} />
          </th>
          <th>
            <TagsFilterField />
          </th>
        </tr>
      </thead>

      <tbody>
        {preparedData.length ? (
          preparedData.map((website, index) => (
            <tr key={website['folderName']}>
              <td data-title="#">{index + 1}</td>
              <td data-title="website">
                <a
                  href={`https://${website['currentHost']}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {website['folderName']}
                </a>
              </td>
              <td data-title="Template">{website['template']}</td>
              <td data-title="CampaignId">{website['campaignId']}</td>
              <td data-title="Main Form">
                {website['MAIN_FORM'] && website['MAIN_FORM']['NAME']}
              </td>
              <td data-title="Alt Form">
                {website['ALT_FORM'] && website['ALT_FORM']['NAME']}
              </td>
              <td data-title="Owner">{website['owner']}</td>
              <td data-title="GTM key">{website['gtmKey']}</td>
              <td data-title="Company Name">{website['companyName']}</td>
              <td data-title="Email">{website['email']}</td>
              <td data-title="Tags">
                <Tags items={website['tags']} />
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
