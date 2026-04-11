"use client";

import { motion } from "framer-motion";
import { Building2, Wifi, Landmark, Home, Users, Lightbulb, Handshake, Scale, Smartphone, Leaf, Globe, Briefcase, Shield } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Animated Typing Text Component
// ─────────────────────────────────────────────────────────────
export const AnimatedTypingText = ({
    text,
    delay = 0,
    className,
    isHeading = false,
}: {
    text: string;
    delay?: number;
    className?: string;
    isHeading?: boolean;
}) => {
    const variants = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, scale: 0.9, filter: "blur(8px)", y: 15 },
        visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            y: 0,
            transition: { duration: 1.0, ease: "easeOut" as const },
        },
    };

    const words = text.split(/(\s+)/);

    const content = words.map((word, wordIndex) => {
        if (word.match(/\s+/)) {
            return (
                <span key={wordIndex} className="inline-block">
                    {word.split("").map((char, charIndex) => (
                        <motion.span
                            key={charIndex}
                            variants={childVariants as any}
                            className="inline-block relative"
                        >
                            {char === "\n" ? <br /> : "\u00A0"}
                        </motion.span>
                    ))}
                </span>
            );
        }

        return (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
                {Array.from(word).map((char, charIndex) => (
                    <motion.span
                        key={charIndex}
                        variants={childVariants as any}
                        className="inline-block relative"
                    >
                        {char}
                    </motion.span>
                ))}
            </span>
        );
    });

    return isHeading ? (
        <motion.h1 className={className} variants={variants} initial="hidden" animate="visible">
            {content}
        </motion.h1>
    ) : (
        <motion.p className={className} variants={variants} initial="hidden" animate="visible">
            {content}
        </motion.p>
    );
};

// ─────────────────────────────────────────────────────────────
// resolveStr: CMS > i18n translation > hardcoded English fallback
// ─────────────────────────────────────────────────────────────
export function resolveStr(
    isClient: boolean,
    t: (key: string, fallback: string) => string,
    cmsStr: string | undefined,
    transKey: string,
    fallbackEn: string
): string {
    if (cmsStr && cmsStr.trim() !== "") return cmsStr;
    return isClient ? t(transKey, fallbackEn) : fallbackEn;
}

// ─────────────────────────────────────────────────────────────
// resolveArray: handles real arrays OR numerically-keyed objects
// ─────────────────────────────────────────────────────────────
export function resolveArray(val: any): any[] | null {
    if (Array.isArray(val)) return val;
    if (val && typeof val === "object") {
        const keys = Object.keys(val).filter((k) => !isNaN(Number(k)));
        if (keys.length > 0) {
            return keys.sort((a, b) => Number(a) - Number(b)).map((k) => val[k]);
        }
    }
    return null;
}

// ─────────────────────────────────────────────────────────────
// getServiceIcon: keyword-matched Lucide SVG icon per service
// ─────────────────────────────────────────────────────────────
export function getServiceIcon(title: string, index: number) {
    const iconProps = { className: "w-10 h-10 sm:w-12 sm:h-12", strokeWidth: 1.5 };
    if (!title) return <Scale {...iconProps} />;
    const lower = title.toLowerCase();

    if (lower.includes("corporate") || lower.includes("commercial") || lower.includes("business"))
        return <Building2 {...iconProps} />;
    if (lower.includes("telecom") || lower.includes("communicat") || lower.includes("network"))
        return <Wifi {...iconProps} />;
    if (lower.includes("bank") || lower.includes("finance") || lower.includes("tax") || lower.includes("capital"))
        return <Landmark {...iconProps} />;
    if (lower.includes("real estate") || lower.includes("property") || lower.includes("conveyance") || lower.includes("land"))
        return <Home {...iconProps} />;
    if (lower.includes("family") || lower.includes("divorce") || lower.includes("marriage"))
        return <Users {...iconProps} />;
    if (lower.includes("intellectual") || lower.includes("ip") || lower.includes("patent") || lower.includes("trademark"))
        return <Lightbulb {...iconProps} />;
    if (lower.includes("employ") || lower.includes("labor") || lower.includes("work"))
        return <Handshake {...iconProps} />;
    if (lower.includes("litigation") || lower.includes("dispute") || lower.includes("court") || lower.includes("criminal") || lower.includes("resolu"))
        return <Scale {...iconProps} />;
    if (lower.includes("tech") || lower.includes("cyber") || lower.includes("data") || lower.includes("it"))
        return <Smartphone {...iconProps} />;
    if (lower.includes("environ") || lower.includes("energy") || lower.includes("nature"))
        return <Leaf {...iconProps} />;
    if (lower.includes("international") || lower.includes("global"))
        return <Globe {...iconProps} />;

    const Fallbacks = [Scale, Briefcase, Shield, Building2, Landmark];
    const FallbackIcon = Fallbacks[index % Fallbacks.length];
    return <FallbackIcon {...iconProps} />;
}
