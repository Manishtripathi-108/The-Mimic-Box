import React, { Suspense } from 'react';

import NavLink from '@/components/ui/NavLink';
import { APP_ROUTES } from '@/constants/routes.constants';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-calc-full-height grid place-items-center px-3">
            <div className="shadow-floating-md to-tertiary from-secondary relative flex min-h-[650px] w-full max-w-(--breakpoint-md) flex-col items-center justify-around rounded-2xl bg-linear-120 from-15% to-85% p-6">
                <div className="shadow-floating-xs to-tertiary from-secondary absolute top-5 mx-auto mb-5 flex w-4/6 gap-x-2 rounded-xl bg-linear-120 from-15% to-85% p-2">
                    <NavLink href={APP_ROUTES.USER_PROFILE} activeClassName="active" className="button w-full text-nowrap">
                        My Profile
                    </NavLink>
                    <NavLink href={APP_ROUTES.USER_LINKED_ACCOUNTS} activeClassName="active" className="button w-full text-nowrap">
                        Linked Accounts
                    </NavLink>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="w-full max-w-xl">{children}</div>
                </Suspense>
            </div>
        </div>
    );
};

export default Layout;
