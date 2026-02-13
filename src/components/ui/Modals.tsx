'use client';

import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { T_IconType } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type ModalProps = React.ComponentProps<'dialog'> & {
    modalId: string;
    showCloseButton?: boolean;
    shouldClose?: boolean | (() => boolean);
    onClose?: () => void;
};

type ConfirmationModalProps = Exclude<ModalProps, 'showCloseButton'> & {
    icon: T_IconType;
    iconClassName?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirmDanger?: boolean;
};

export const closeModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) modalElement.close();
};

export const openModal = (modalId: string) => {
    const modalElement = document.getElementById(modalId) as HTMLDialogElement;
    if (modalElement) modalElement.showModal();
};

const Modal = ({ modalId, className = '', showCloseButton = true, children, shouldClose = () => true, onClose, ...props }: ModalProps) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && (typeof shouldClose === 'function' ? shouldClose() : shouldClose)) {
            closeModal(modalId);
        }
    };

    const handleCloseClick = () => {
        if (typeof shouldClose === 'function' ? shouldClose() : shouldClose) {
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
                'shadow-pressed-md bg-gradient-secondary-to-tertiary m-auto hidden w-full max-w-2xl scale-0 overflow-visible rounded-2xl border p-2 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out sm:p-6',
                'backdrop:bg-primary backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in',
                'open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100',
                'starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0',
                className
            )}
            {...props}>
            <div className="shadow-floating-md w-full max-w-full overflow-hidden rounded-xl">
                {showCloseButton && (
                    <Button
                        title="Close Modal"
                        icon="close"
                        className="absolute top-2 right-2 z-20"
                        onClick={handleCloseClick}
                        aria-label="Close Modal"></Button>
                )}
                <div className="scrollbar-thin max-h-[calc(100dvh-6rem)] w-full max-w-full overflow-y-auto overscroll-x-none">{children}</div>
            </div>
        </dialog>
    );
};

export const ConfirmationModal = ({
    modalId,
    icon,
    iconClassName,
    onConfirm,
    onCancel,
    confirmText = 'Yes',
    cancelText = 'No',
    children,
    isConfirmDanger = false,
    shouldClose = () => true,
    onClose,
    ...props
}: ConfirmationModalProps) => {
    const handleCancelClick = () => {
        if (onCancel) onCancel();

        if (typeof shouldClose === 'function' ? shouldClose() : shouldClose) closeModal(modalId);
    };

    const handleConfirmClick = () => {
        onConfirm();
        if (typeof shouldClose === 'function' ? shouldClose() : shouldClose) closeModal(modalId);
    };

    return (
        <Modal modalId={modalId} shouldClose={shouldClose} className="max-w-md" onClose={onClose} showCloseButton={false} {...props}>
            <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                <Icon icon={icon} className={cn('text-danger mx-auto mb-4 size-12', iconClassName)} />
                <h3 className="text-text-primary mb-5 text-lg font-normal">{children}</h3>
                <Button onClick={handleConfirmClick} title={confirmText} variant={isConfirmDanger ? 'danger' : 'primary'} className="mt-4">
                    {confirmText}
                </Button>
                <Button title={cancelText} variant={!isConfirmDanger ? 'danger' : 'primary'} className="mt-4 ml-4" onClick={handleCancelClick}>
                    {cancelText}
                </Button>
            </div>
        </Modal>
    );
};

export default Modal;
