import { useDispatch } from 'react-redux';

import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { toggleInfoModalOpened } from '../features/app/app.slice';

export function InfoModalBtn() {
  const dispatch = useDispatch();

  function onOpen() {
    dispatch(toggleInfoModalOpened(true));
    triggerGtmEvent(gtmEvents.openInfoModal);
  }

  return (
    <>
      <button
        className="btn btn--with-icon"
        onClick={onOpen}
        data-qa="infoModal"
      >
        <span className="icon icon--info-modal">?</span> info modal
      </button>
    </>
  );
}
