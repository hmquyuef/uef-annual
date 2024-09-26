"use client";

import React, { useState } from 'react';

interface LoginLayoutProps {
    children: React.ReactNode;
}

export default function LoginLayout({ children }: LoginLayoutProps) {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <React.Fragment>
            login layout
            {children}
        </React.Fragment>
    );
}
