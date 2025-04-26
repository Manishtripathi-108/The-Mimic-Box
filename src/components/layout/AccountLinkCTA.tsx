import { $Enums } from '@prisma/client';

import Icon from '@/components/ui/Icon';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';

const AccountLinkCTA = ({ account, callBackUrl, message }: { account: $Enums.LinkedAccountProvider; callBackUrl?: string; message?: string }) => {
    message = message || `Link your ${account.toLowerCase()} account to view and manage your collection.`;
    return (
        <section className="shadow-floating-xs to-tertiary from-secondary grid place-items-center gap-5 rounded-xl bg-linear-150 from-15% to-85% p-6">
            <Icon icon="error" className="size-32" />
            <h2 className="text-xl font-semibold text-red-400">
                Oops! You are not connected to <strong className="capitalize">{account.toLowerCase()}</strong>.
            </h2>
            <p className="text-text-secondary">{message}</p>
            <ConnectAccount account={account} className="button" callBackUrl={callBackUrl} />
        </section>
    );
};

export default AccountLinkCTA;
