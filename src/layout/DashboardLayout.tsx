"use client";

import MenuLeft from '@/components/MenuLeft';
import TopHeaders from '@/components/TopHeader';
import React from 'react';
interface DashboardLayoutProps {
    children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <React.Fragment>
            <div className='h-svh bg-gray-50 flex'>
                <MenuLeft />
                <div className='flex-1'>
                    <TopHeaders />
                    {children}
                </div>
            </div>
        </React.Fragment>
    );
}
