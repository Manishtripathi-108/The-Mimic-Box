import { $Enums } from '@prisma/client';

import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { ConnectAccount } from '@/components/ui/LinkedAccountButtons';

const AccountLinkCTA = ({ account, callBackUrl, message }: { account: $Enums.LinkedAccountProvider; callBackUrl?: string; message?: string }) => {
    message = message || `Link your ${account.toLowerCase()} account to view and manage your collection.`;
    return (
        <section className="shadow-floating-xs bg-gradient-secondary-to-tertiary grid place-items-center gap-5 rounded-xl p-6">
            <Icon icon="error" className="size-32" />
            <h2 className="text-xl font-semibold text-red-400">
                Oops! You are not connected to <strong className="capitalize">{account.toLowerCase()}</strong>.
            </h2>
            <p className="text-text-secondary">{message}</p>
            <Button asChild>
                <ConnectAccount account={account} callBackUrl={callBackUrl} />
            </Button>
        </section>
    );
};

export default AccountLinkCTA;
