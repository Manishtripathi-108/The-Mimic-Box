'use client';

import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { T_IconType } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type ModalProps = {
    modalId: string;
    className?: string;
    showCloseButton?: boolean;
    children: React.ReactNode;
    shouldClose?: () => boolean;
    onClose?: () => void;
} & React.HTMLProps<HTMLDialogElement>;

type ConfirmationModalProps = {
    modalId: string;
    icon: T_IconType;
    iconClassName?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    children: React.ReactNode;
    isConfirmDanger?: boolean;
    shouldClose?: () => boolean;
    onClose?: () => void;
} & React.HTMLProps<HTMLDialogElement>;

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
                'from-secondary to-tertiary shadow-pressed-md m-auto hidden w-full max-w-2xl scale-0 overflow-visible rounded-2xl border bg-linear-150 from-15% to-85% p-2 opacity-0 outline-hidden transition-all transition-discrete duration-300 ease-in-out sm:p-6',
                'backdrop:bg-primary backdrop:opacity-75 backdrop:transition-all backdrop:transition-discrete backdrop:duration-300 backdrop:ease-in',
                'open:block open:scale-100 open:opacity-100 open:delay-300 open:backdrop:scale-100',
                'starting:open:scale-0 starting:open:opacity-0 starting:open:backdrop:scale-x-100 starting:open:backdrop:scale-y-0',
                className
            )}
            {...props}>
            <div className="shadow-floating-md w-full max-w-full overflow-hidden rounded-xl">
                {showCloseButton && (
                    <button
                        title="Close Modal"
                        type="button"
                        className="text-text-secondary hover:text-text-primary bg-secondary absolute top-2 right-2 z-20 cursor-pointer rounded-full p-1 text-lg select-none"
                        onClick={handleCloseClick}
                        aria-label="Close Modal">
                        <Icon icon="close" className="size-6" />
                    </button>
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

        if (shouldClose()) closeModal(modalId);
    };

    const handleConfirmClick = () => {
        onConfirm();
        if (shouldClose()) closeModal(modalId);
    };

    return (
        <Modal modalId={modalId} shouldClose={shouldClose} className="max-w-md" onClose={onClose} {...props}>
            <div className="relative max-h-full w-full max-w-md p-8 text-center md:p-10">
                <Icon icon={icon} className={cn('mx-auto mb-4 size-12 text-red-500', iconClassName)} />
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
