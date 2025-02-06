"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshButton({ className, children }: { className?: HTMLButtonElement["className"], children?: React.ReactNode }) {
    const { refresh } = useRouter();
    const [ isRefreshing, setIsRefreshing ] = useState(false);
    return (
        <button onClick={async () => {setIsRefreshing(false);await refresh();setIsRefreshing(false);}} disabled={isRefreshing} className={className}>
            {children}
        </button>
    );
}