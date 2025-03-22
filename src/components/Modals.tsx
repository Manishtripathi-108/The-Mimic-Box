'use client';

import React from 'react';

import { Icon } from '@iconify/react';

import ICON_SET from '@/constants/icons';
import cn from '@/lib/utils/cn';

export const closeModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) modalElement.close();
};

export const openModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) modalElement.showModal();
};

const Modal = ({
    modalId,
    className = '',
    showCloseButton = true,
    children,
    shouldClose = () => true,
    onClose,
}: {
    modalId: string;
    className?: string;
    showCloseButton?: boolean;
    children: React.ReactNode;
    shouldClose?: () => boolean;
    onClose?: () => void;
}) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && shouldClose()) {
            closeModal(modalId);
        }
    };

    const handleCloseClick = () => {
        if (shouldClose()) {
            closeModal(modalId);
        }
    };

    const handleDialogClose = () => {
        if (onClose) onClose();
    };

    return (
        <dialog
            id={modalId}
            onClick={handleBackdropClick}
            onClose={handleDialogClose}
            className={cn(
                'bg-primary shadow-pressed-md m-auto hidden w-full max-w-2xl scale-0 overflow-visible rounded-2xl border p-5 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out',
                'backdrop:bg-primary backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in',
                'open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100',
                'starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0',
                className
            )}>
            <div className="shadow-floating-md w-full max-w-full overflow-hidden rounded-xl border">
                {showCloseButton && (
                    <button
                        title="Close Modal"
                        type="button"
                        className="text-text-secondary hover:text-text-primary bg-secondary absolute top-2 right-2 z-20 cursor-pointer rounded-full p-1 text-lg select-none"
                        onClick={handleCloseClick}
                        aria-label="Close Modal">
                        <Icon icon={ICON_SET.CLOSE} className="size-6" />
                    </button>
                )}
                <div className="scrollbar-thin max-h-[calc(100vh-6rem)] w-full max-w-full overflow-y-auto overscroll-x-none">{children}</div>
            </div>
        </dialog>
    );
};

export const ConfirmationModal = ({
    modalId,
    icon,
    onConfirm,
    onCancel,
    confirmText = 'Yes',
    cancelText = 'No',
    children,
    isConfirmDanger = false,
    shouldClose = () => true,
    onClose,
}: {
    modalId: string;
    icon: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    children: React.ReactNode;
    isConfirmDanger?: boolean;
    shouldClose?: () => boolean;
    onClose?: () => void;
}) => {
    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
        if (shouldClose()) {
            closeModal(modalId);
        }
    };

    const handleConfirmClick = () => {
        onConfirm();
        if (shouldClose()) {
            closeModal(modalId);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && shouldClose()) {
            closeModal(modalId);
        }
    };

    const handleDialogClose = () => {
        if (onClose) onClose();
    };

    return (
        <dialog
            id={modalId}
            onClick={handleBackdropClick}
            onClose={handleDialogClose}
            className="bg-primary shadow-pressed-md backdrop:bg-primary m-auto hidden w-fit max-w-2xl scale-0 rounded-xl border p-5 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100 starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0">
            <div className="shadow-floating-md overflow-hidden rounded-lg border">
                <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                    <Icon icon={icon} className="mx-auto mb-4 size-12 text-red-500" />
                    <h3 className="text-text-primary mb-5 text-lg font-normal">{children}</h3>
                    <button onClick={handleConfirmClick} title={confirmText} className={`button ${isConfirmDanger && 'button-danger'}`}>
                        {confirmText}
                    </button>
                    <button title={cancelText} className={`button mt-4 ml-4 ${isConfirmDanger && 'button-danger'}`} onClick={handleCancelClick}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default Modal;
