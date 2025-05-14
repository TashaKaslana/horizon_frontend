import { JSX, SVGProps } from "react";

interface AchievementIconProps extends JSX.IntrinsicAttributes, SVGProps<SVGSVGElement> {
    variant?: "beginner" | "intermediate" | "expert";
}

const gradientColors: Record<NonNullable<AchievementIconProps["variant"]>, [string, string, string]> = {
    beginner: ["#57CC99", "#38A3A5", "#22577A"],
    intermediate : ["#FF6B6B", "#FFA07A", "#FFD166"],
    expert: ["#4C1D95", "#6D28D9", "#9333EA"],
};

export const AchievementIcon = ({ variant = "beginner", ...props }: AchievementIconProps) => {
    const colors = gradientColors[variant];

    const gradientId = `gradient-${variant}`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" {...props}>
            <defs>
                <radialGradient id={gradientId}
                                cx={0}
                                cy={0}
                                r={1}
                                gradientTransform="matrix(16.1326 5.4553 -43.70045 129.2322 1.588 6.503)"
                                gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0.067" stopColor={colors[0]} />
                    <stop offset="0.343" stopColor={colors[1]} />
                    <stop offset="0.672" stopColor={colors[2]} />
                </radialGradient>
            </defs>
            <path
                fill={`url(#${gradientId})`}
                d="M16 8.016A8.522 8.522 0 0 0 8.016 16h-.032A8.521 8.521 0 0 0 0 8.016v-.032A8.521 8.521 0 0 0 7.984 0h.032A8.522 8.522 0 0 0 16 7.984v.032z"
            />
        </svg>
    );
};
