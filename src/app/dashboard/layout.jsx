import { DashboardSideBar } from '@/components/dashboard/DashboardSideBar';
import React from 'react';

const DashBoardLoayout = ({ children }) => {
    return (
        <div className='flex min-h-screen'>
            <DashboardSideBar></DashboardSideBar>
            <div className='flex-1'>{children}</div>
        </div>
    );
};

export default DashBoardLoayout;