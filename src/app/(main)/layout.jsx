import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import React from 'react';

const Mainlayout = ({ children }) => {
    return (
        <div>
            <NavBar></NavBar>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default Mainlayout;