import { cn } from "@/lib/utils"

interface LogoProps {
    className?: string
    size?: number
}

export const Logo = ({ className, size = 40 }: LogoProps) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("transition-all duration-200", className)}
        >
            {/* Background Circle */}
            <circle
                cx="50"
                cy="50"
                r="45"
                className="fill-primary/10 stroke-primary"
                strokeWidth="2"
            />

            {/* Connected Nodes representing collaboration */}
            <path
                d="M30 50 L50 30 L70 50 L50 70 Z"
                className="stroke-primary"
                strokeWidth="2"
                fill="none"
            />

            {/* Task checkmark */}
            <path
                d="M40 50 L47 57 L60 44"
                className="stroke-primary"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Connection points */}
            <circle cx="30" cy="50" r="4" className="fill-primary" />
            <circle cx="50" cy="30" r="4" className="fill-primary" />
            <circle cx="70" cy="50" r="4" className="fill-primary" />
            <circle cx="50" cy="70" r="4" className="fill-primary" />
        </svg>
    )
}