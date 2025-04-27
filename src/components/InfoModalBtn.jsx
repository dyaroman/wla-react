import { useDispatch, useSelector } from 'react-redux';

import { useShortcut } from '../hooks/useShortcut';
import { triggerGtmEvent } from '../misc/functions';
import { gtmEvents } from '../misc/gtm.constants';
import { TOGGLE_INFO_MODAL_OPENED } from '../features/app/app.constants';

export function InfoModalBtn() {
  const dispatch = useDispatch();
  const infoModalOpened = useSelector((state) => state['app'].infoModalOpened);

  // open info modal
  useShortcut(['Shift', '/'], (event) => {
    if (infoModalOpened) return;
    event.preventDefault();
    onOpenModalClick();
    triggerGtmEvent(gtmEvents.shortcut, {
      method: 'open-info-modal',
    });
  });

  function onOpenModalClick() {
    dispatch({
      type: TOGGLE_INFO_MODAL_OPENED,
      payload: true,
    });
    triggerGtmEvent(gtmEvents.openInfoModal);
  }

  return (
    <button
      className="btn btn--icon"
      onClick={onOpenModalClick}
      data-qa="infoModal"
    >
      <span className="icon icon--info-modal">?</span> info modal
    </button>
  );
}
