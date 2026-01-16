import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface UseCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
}

export const useCounter = ({ end, duration = 2000, suffix = "" }: UseCounterProps) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isInView || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * end);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return { count, ref, suffix };
};

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    label: string;
    duration?: number;
}

export const AnimatedCounter = ({ value, suffix = "+", label, duration = 2000 }: AnimatedCounterProps) => {
    const { count, ref } = useCounter({ end: value, duration });

    return (
        <div ref={ref} className="text-center">
            <div className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {count.toLocaleString()}
                <span className="text-accent">{suffix}</span>
            </div>
            <div className="text-muted-foreground text-sm mt-1 font-body uppercase tracking-wider">
                {label}
            </div>
        </div>
    );
};

export default AnimatedCounter;
