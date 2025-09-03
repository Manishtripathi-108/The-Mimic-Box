import cn from '@/lib/utils/cn';

import ErrorMessage from './ErrorMessage';
import HelperText from './HelperText';
import Label from './Label';

type FormFieldProps = {
    id: string;
    label?: string;
    error?: string | null;
    helper?: string;
    children: React.ReactNode;
    className?: string;
};

const FormField = ({ id, label, error, helper, children, className }: FormFieldProps) => {
    return (
        <div className={cn('w-full space-y-1', className)}>
            {/* Accessible label */}
            {label && <Label htmlFor={id}>{label}</Label>}

            {children}

            {/* error / helper text */}
            {error ? <ErrorMessage message={error} /> : <HelperText>{helper}</HelperText>}
        </div>
    );
};

export default FormField;
