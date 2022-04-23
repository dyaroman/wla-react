import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FilterTitle } from './FilterTitle';
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
  const recaptchaKeyColumn = websiteDataStructure.includes('recaptchaKey');
  const address1Column = websiteDataStructure.includes('address1');
  const address2Column = websiteDataStructure.includes('address2');

  return (
    <>
      <section className="table">
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
              {gtmKeyColumn && (
                <FilterTitle text="GTM key" columnName="gtmKey" />
              )}
              {recaptchaKeyColumn && (
                <FilterTitle text="ReCaptcha key" columnName="recaptchaKey" />
              )}
              <FilterTitle text="Company Name" columnName="companyName" />
              <FilterTitle text="Email" columnName="email" />
              {address1Column && (
                <FilterTitle text="Address 1" columnName="address1" />
              )}
              {address2Column && (
                <FilterTitle text="Address 2" columnName="address2" />
              )}
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
                  recaptchaKey,
                  companyName,
                  email,
                  address1,
                  address2,
                } = website;
                return (
                  <tr key={folderName}>
                    <td data-title="#">{index + 1}</td>
                    <th data-title="website">
                      <a
                        href={`https://${currentHost}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {folderName}
                      </a>
                    </th>
                    <td data-title="Template">{template}</td>
                    {campaignIdColumn && (
                      <td data-title="CampaignId">{campaignId}</td>
                    )}
                    <td data-title="Main Form">
                      {MAIN_FORM && MAIN_FORM['NAME']}
                    </td>
                    {altFormColumn && (
                      <td data-title="Alt Form">{ALT_FORM['NAME']}</td>
                    )}
                    {ownerColumn && <td data-title="Owner">{owner}</td>}
                    {gtmKeyColumn && <td data-title="GTM key">{gtmKey}</td>}
                    {recaptchaKeyColumn && (
                      <td data-title="ReCaptcha key">{recaptchaKey}</td>
                    )}
                    <td data-title="Company Name">{companyName}</td>
                    <td data-title="Email">{email}</td>
                    {address1Column && (
                      <td data-title="Address 1">{address1}</td>
                    )}
                    {address2Column && (
                      <td data-title="Address 2">{address2}</td>
                    )}
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
      </section>
    </>
  );
}
