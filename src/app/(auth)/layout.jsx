import NavBar from '@/components/NavBar';
import React from 'react';

const Authlayout = ({ children }) => {
    return (
        <div>
            <NavBar></NavBar>
            {children}
        </div>
    );
};

export default Authlayout;