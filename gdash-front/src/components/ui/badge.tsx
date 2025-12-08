import React from "react";

// Componente Badge inline (renomeado para StatusBadge para evitar conflito com Lucide)
export const StatusBadge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'success' | 'warning' | 'danger' }>(
    ({ className, variant = 'success', ...props }, ref) => {
        const variants = {
            success: "bg-green-100 text-green-700",
            warning: "bg-yellow-100 text-yellow-700",
            danger: "bg-red-100 text-red-700"
        };

        return (
            <div
                ref={ref}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className || ''}`}
                {...props}
            />
        );
    }
);