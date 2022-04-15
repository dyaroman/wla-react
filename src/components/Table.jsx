import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterField } from './FilterField';
import { FilterTitle } from './FilterTitle';
import { Tags } from './Tags';
import { TagsFilterField } from './TagsFilterField';
import { updateTableData } from '../features/table/table.actions';
import { updateURL } from '../misc/functions';

export function Table() {
  const dispatch = useDispatch();
  const { sort, filters, preparedData, websiteDataStructure } = useSelector(
    (state) => state['table']
  );

  useEffect(() => {
    dispatch(updateTableData());
    updateURL({
      ...filters,
      ...sort,
    });
  }, [dispatch, filters, sort]);

  const campaignIdColumn = websiteDataStructure.includes('campaignId');
  const altFormColumn = websiteDataStructure.includes('ALT_FORM');
  const ownerColumn = websiteDataStructure.includes('owner');
  const gtmKeyColumn = websiteDataStructure.includes('gtmKey');
  const address1Column = websiteDataStructure.includes('address1');
  const address2Column = websiteDataStructure.includes('address2');

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <FilterTitle text="Website" columnName="website" />
          <FilterTitle text="Template" columnName="template" />
          {campaignIdColumn && (
            <FilterTitle text="CampaignId" columnName="campaignId" />
          )}
          <FilterTitle text="Main Form" columnName="mainForm" />
          {altFormColumn && (
            <FilterTitle text="Alt Form" columnName="altForm" />
          )}
          {ownerColumn && <FilterTitle text="Owner" columnName="owner" />}
          {gtmKeyColumn && <FilterTitle text="GTM key" columnName="gtmKey" />}
          <FilterTitle text="Company Name" columnName="companyName" />
          <FilterTitle text="Email" columnName="email" />
          {address1Column && (
            <FilterTitle text="Address 1" columnName="address1" />
          )}
          {address2Column && (
            <FilterTitle text="Address 2" columnName="address2" />
          )}
          <th>Tags</th>
        </tr>

        <tr>
          <th />
          <th>
            <FilterField name={'website'} placeholder={'website'} />
          </th>
          <th>
            <FilterField name={'template'} placeholder={'template'} />
          </th>
          {campaignIdColumn && (
            <th>
              <FilterField name={'campaignId'} placeholder={'campaign id'} />
            </th>
          )}
          <th>
            <FilterField name={'mainForm'} placeholder={'main form'} />
          </th>
          {altFormColumn && (
            <th>
              <FilterField name={'altForm'} placeholder={'alt form'} />
            </th>
          )}
          {ownerColumn && (
            <th>
              <FilterField name={'owner'} placeholder={'owner'} />
            </th>
          )}
          {gtmKeyColumn && (
            <th>
              <FilterField name={'gtmKey'} placeholder={'gtm key'} />
            </th>
          )}
          <th>
            <FilterField name={'companyName'} placeholder={'company name'} />
          </th>
          <th>
            <FilterField name={'email'} placeholder={'email'} />
          </th>
          {address1Column && (
            <th>
              <FilterField name={'address1'} placeholder={'address 1'} />
            </th>
          )}
          {address2Column && (
            <th>
              <FilterField name={'address2'} placeholder={'address 2'} />
            </th>
          )}
          <th>
            <TagsFilterField />
          </th>
        </tr>
      </thead>

      <tbody>
        {preparedData.length ? (
          preparedData.map((website, index) => {
            const {
              folderName,
              currentHost,
              template,
              campaignId,
              MAIN_FORM,
              ALT_FORM,
              owner,
              gtmKey,
              companyName,
              email,
              address1,
              address2,
              tags,
            } = website;
            return (
              <tr key={folderName}>
                <td data-title="#">{index + 1}</td>
                <td data-title="website">
                  <a
                    href={`https://${currentHost}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {folderName}
                  </a>
                </td>
                <td data-title="Template">{template}</td>
                {campaignIdColumn && (
                  <td data-title="CampaignId">{campaignId}</td>
                )}
                <td data-title="Main Form">{MAIN_FORM && MAIN_FORM['NAME']}</td>
                {altFormColumn && (
                  <td data-title="Alt Form">{ALT_FORM['NAME']}</td>
                )}
                {ownerColumn && <td data-title="Owner">{owner}</td>}
                {gtmKeyColumn && <td data-title="GTM key">{gtmKey}</td>}
                <td data-title="Company Name">{companyName}</td>
                <td data-title="Email">{email}</td>
                {address1Column && <td data-title="Address 1">{address1}</td>}
                {address2Column && <td data-title="Address 2">{address2}</td>}
                <td data-title="Tags">
                  <Tags items={tags} />
                </td>
              </tr>
            );
          })
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
