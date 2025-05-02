import { useDispatch } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { TOGGLE_INFO_MODAL_OPENED } from '../features/app/app.constants';

export function InfoModalBtn() {
  const dispatch = useDispatch();

  function onOpen() {
    dispatch({
      type: TOGGLE_INFO_MODAL_OPENED,
      payload: true,
    });
    triggerGtmEvent(gtmEvents.openInfoModal);
  }

  return (
    <>
      <button className="btn btn--icon" onClick={onOpen} data-qa="infoModal">
        <span className="icon icon--info-modal">?</span> info modal
      </button>
    </>
  );
}
