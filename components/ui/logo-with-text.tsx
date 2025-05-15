import { cn } from "@/lib/utils"
import { Logo } from "./logo"

interface LogoWithTextProps {
    className?: string
    size?: number
}

export const LogoWithText = ({ className, size = 40 }: LogoWithTextProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Logo size={size} />
            <span className="font-semibold text-xl tracking-tight">Shughuli</span>
        </div>
    )
}