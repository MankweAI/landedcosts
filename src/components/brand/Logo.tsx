import { Layers, ShieldCheck } from "lucide-react";

type LogoProps = {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    collapsed?: boolean;
    variant?: "dark" | "light";
};

export function Logo({
    className = "",
    iconClassName = "h-8 w-8",
    textClassName = "text-xl",
    collapsed = false,
    variant = "dark"
}: LogoProps) {
    const textColor = variant === "light" ? "text-white" : "text-slate-900";
    const subTextColor = variant === "light" ? "text-blue-400" : "text-blue-600";

    if (collapsed) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <div className="relative flex items-center justify-center">
                    <Layers className={`${iconClassName} ${variant === "light" ? "text-white" : "text-slate-900"}`} />
                    <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-0.5 ring-2 ring-white">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="relative flex items-center justify-center">
                <Layers className={`${iconClassName} ${variant === "light" ? "text-white" : "text-slate-900"}`} />
                <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-0.5 ring-2 ring-white">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
            </div>
            <div className={`flex flex-col leading-none ${textColor}`}>
                <span className={`font-bold tracking-tight ${textClassName}`}>
                    LandedCost
                </span>
                <span className={`text-[0.6em] font-bold uppercase tracking-widest ${subTextColor}`}>
                    Intelligence
                </span>
            </div>
        </div>
    );
}
