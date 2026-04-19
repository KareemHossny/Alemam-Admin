import React, { useCallback, useMemo, useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

const INITIAL_STATE = {
  isOpen: false,
  title: 'Confirm action',
  message: 'Are you sure you want to continue?',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  tone: 'danger',
  onConfirm: null,
};

const useConfirmationModal = () => {
  const [modalState, setModalState] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);

  const closeConfirmation = useCallback(() => {
    if (isLoading) {
      return;
    }

    setModalState(INITIAL_STATE);
  }, [isLoading]);

  const openConfirmation = useCallback((config) => {
    setModalState({
      ...INITIAL_STATE,
      ...config,
      isOpen: true,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!modalState.onConfirm) {
      closeConfirmation();
      return;
    }

    try {
      setIsLoading(true);
      await modalState.onConfirm();
      setModalState(INITIAL_STATE);
    } finally {
      setIsLoading(false);
    }
  }, [closeConfirmation, modalState]);

  const confirmationModal = useMemo(() => (
    <ConfirmationModal
      isOpen={modalState.isOpen}
      title={modalState.title}
      message={modalState.message}
      confirmLabel={modalState.confirmLabel}
      cancelLabel={modalState.cancelLabel}
      tone={modalState.tone}
      isLoading={isLoading}
      onConfirm={handleConfirm}
      onClose={closeConfirmation}
    />
  ), [closeConfirmation, handleConfirm, isLoading, modalState]);

  return {
    openConfirmation,
    closeConfirmation,
    confirmationModal,
  };
};

export default useConfirmationModal;
