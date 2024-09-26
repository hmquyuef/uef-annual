import LoginLayout from '@/layout/LoginLayout';
import { Metadata } from 'next';
import React from 'react';

interface LoginLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login'
};

export default function SimpleLayout({ children }: LoginLayoutProps) {
    return (
        <LoginLayout>{children}</LoginLayout>
    );
}