import { useEffect, useRef } from 'react';

/**
 * Custom hook that listens for browser/mobile Back button press
 * and automatically closes the active modal instead of leaving the page.
 */
export function useBackToCloseModal(isOpen: boolean, onClose: () => void) {
  const closedByBackRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    closedByBackRef.current = false;
    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = () => {
      closedByBackRef.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (!closedByBackRef.current && window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);
}
