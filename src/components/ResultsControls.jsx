import { useSelector } from 'react-redux';

import { InfoModalBtn } from './InfoModalBtn';
import {
  convertUrlToEnv,
  getQueryParamValue,
  handleClipboardCopy,
  triggerGtmEvent,
} from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { COLUMNS } from '../misc/columns.constants';

export function ResultsControls() {
  const websitesData = useSelector((state) => state['table'].websitesData);
  const preparedData = useSelector((state) => state['table'].preparedData);
  const env = websitesData['env'];
  const convertLinksTo =
    getQueryParamValue('convertLinksTo') || getQueryParamValue('clt');
  const convertLinks = convertLinksTo && convertLinksTo !== env;

  async function onCopyWebsitesUrlsClick() {
    const websitesUrls = preparedData
      .map((website) => {
        const host =
          (convertLinks &&
            convertUrlToEnv(website[COLUMNS.website], convertLinksTo)) ||
          website[COLUMNS.host];

        return `https://${host}/`;
      })
      .join('\n');
    handleClipboardCopy(websitesUrls);

    triggerGtmEvent(gtmEvents.btn, {
      method: 'copy-websites-urls',
    });
  }

  async function onCopyWebsitesClick() {
    const formattedWebsitesList = preparedData
      .map((website) => website[COLUMNS.website])
      .join('\n');
    handleClipboardCopy(formattedWebsitesList);

    triggerGtmEvent(gtmEvents.btn, {
      method: 'copy-websites',
    });
  }

  if (preparedData.length === 0) {
    return null;
  }

  return (
    <div className="flex-column">
      <button
        className="btn"
        onClick={onCopyWebsitesClick}
        data-qa="copyWebsites"
      >
        copy websites
      </button>

      <button
        className="btn"
        onClick={onCopyWebsitesUrlsClick}
        data-qa="copyWebsitesUrls"
      >
        copy websites urls
      </button>

      <InfoModalBtn />
    </div>
  );
}
