"use client";

import React, { useState } from 'react';

interface LoginLayoutProps {
    children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    );
}
