import Icon from '@/components/ui/Icon';
import Input from '@/components/ui/form/Input';
import { T_IconType } from '@/lib/types/client.types';
import cn from '@/lib/utils/cn';

type InputWithIconProps = React.ComponentProps<'input'> & {
    icon: T_IconType;
    iconPosition?: 'left' | 'right';
};

const InputWithIcon = ({ icon, iconPosition = 'left', className, ...props }: InputWithIconProps) => {
    return (
        <div data-component="form" data-element="field" data-field-type="input" className="relative w-full">
            <Input {...props} className={cn('peer', iconPosition === 'left' ? 'pl-10' : 'pr-10', className)} />

            <span
                className={cn(
                    iconPosition === 'left' ? 'left-3' : 'right-3',
                    'text-text-secondary pointer-events-none absolute inset-y-0 flex items-center transition-colors',
                    'peer-hover:text-text-primary peer-focus:text-text-primary',
                    'peer-data-[invalid=true]:text-danger peer-user-invalid:text-danger peer-user-valid:text-success',
                    'peer-placeholder-shown:text-text-secondary peer-[not(:placeholder-shown)]:text-text-primary',
                    'peer-disabled:opacity-50'
                )}>
                <Icon icon={icon} className="size-5" />
            </span>
        </div>
    );
};

export default InputWithIcon;
