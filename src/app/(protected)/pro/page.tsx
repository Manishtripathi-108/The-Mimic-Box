import { auth } from '@/auth';
import React from 'react';

const Pro = async () => {
    const session = await auth();
    return <div className="text-text-primary text-center">{JSON.stringify(session)}</div>;
};

export default Pro;
