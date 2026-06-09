"use client";
import { useSession } from '@/lib/auth-client';
import React from 'react';
import { FileText, Users, Zap, CheckCircle2 } from "lucide-react";
import DashboardStats from '@/components/dashboard/DashboardStats';


const RecruiterPage = () => {
    const { data: sessionData, isPending } = useSession();
    if (isPending) {
        return <div>Loading...</div>;
    }
    const user = sessionData?.user;
    console.log('user', user);

    const recruiterStats = [
        { title: "Total Job Posts", value: "48", icon: FileText },
        { title: "Total Applicants", value: "1,284", icon: Users },
        { title: "Active Jobs", value: "18", icon: Zap },
        { title: "Jobs Closed", value: "32", icon: CheckCircle2 },
    ];
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 mt-6">welcome back {user?.name}</h2>
            <DashboardStats statsData={recruiterStats} />
        </div>
    );
};

export default RecruiterPage;