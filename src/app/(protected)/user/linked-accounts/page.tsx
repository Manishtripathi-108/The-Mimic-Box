import { Metadata } from 'next';

import { LinkedAccountProvider } from '@prisma/client';

import { auth } from '@/auth';
import Icon from '@/components/ui/Icon';
import { ConnectAccount, DisconnectAccount } from '@/components/ui/LinkedAccountButtons';
import { APP_ROUTES } from '@/constants/routes.constants';

export const metadata: Metadata = {
    title: 'Linked Accounts',
    description: 'Manage your linked accounts on The Mimic Box.',
};

const UserLinkedAccounts = async () => {
    const session = await auth();
    const linkedAccounts = session?.user?.linkedAccounts ?? {};
    return (
        <div className="shadow-floating-xs rounded-2xl p-6">
            <h1 className="text-text-primary font-alegreya mb-4 text-center text-xl tracking-wide">Linked Accounts</h1>
            <div className="shadow-pressed-xs grid gap-4 rounded-lg border p-4">
                {Object.values(LinkedAccountProvider).map((account) => {
                    const isLinked = linkedAccounts && linkedAccounts[account];
                    return (
                        <div
                            key={account}
                            className="bg-primary border-primary shadow-floating-xs text-text-secondary hover:text-text-primary flex items-center justify-between rounded-lg border px-4 py-2 text-sm">
                            <div className="flex items-center gap-x-2">
                                <Icon icon={account} className="mr-2 inline-block size-6" />
                                <p className="font-medium capitalize">{account}</p>
                            </div>

                            {isLinked ? (
                                <>
                                    <span className="text-center font-medium text-green-600">
                                        <Icon icon="link" className="mr-1 inline size-5" />
                                        Connected
                                    </span>
                                    <DisconnectAccount
                                        className="w-20 cursor-pointer text-center text-red-500 disabled:text-red-600"
                                        account={account}>
                                        Disconnect
                                    </DisconnectAccount>
                                </>
                            ) : (
                                <>
                                    <span className="text-center font-medium text-red-600">
                                        <Icon icon="unlink" className="mr-1 inline size-5" />
                                        Not Connected
                                    </span>
                                    <ConnectAccount
                                        callBackUrl={APP_ROUTES.USER_LINKED_ACCOUNTS}
                                        className="w-20 cursor-pointer text-center text-green-500 capitalize disabled:text-green-600"
                                        account={account}>
                                        Connect
                                    </ConnectAccount>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserLinkedAccounts;
