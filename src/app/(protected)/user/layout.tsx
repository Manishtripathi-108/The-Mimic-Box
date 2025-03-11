import NavLink from '@/components/ui/NavLink';
import { APP_ROUTES } from '@/constants/routes.constants';
import React, { Suspense } from 'react';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-calc-full-height grid place-items-center">
            <div className="shadow-floating-md to-tertiary from-secondary w-full max-w-(--breakpoint-md) rounded-2xl bg-linear-120 from-15% to-85% p-6">
                <div className="shadow-floating-xs to-tertiary from-secondary mx-auto mb-5 flex w-4/6 gap-x-2 rounded-xl bg-linear-120 from-15% to-85% p-2">
                    <NavLink href={APP_ROUTES.USER.PROFILE} activeClassName="active" className="button w-full text-nowrap">
                        My Profile
                    </NavLink>
                    <NavLink href={APP_ROUTES.USER.LINKED_ACCOUNTS} activeClassName="active" className="button w-full text-nowrap">
                        Linked Accounts
                    </NavLink>
                    <NavLink href={APP_ROUTES.USER.SETTINGS} activeClassName="active" className="button w-full text-nowrap">
                        Settings
                    </NavLink>
                </div>
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
        </div>
    );
};

export default UserLayout;
