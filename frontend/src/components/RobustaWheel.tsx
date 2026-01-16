import { useState } from "react";
import { motion } from "framer-motion";
import { Coffee, BatteryCharging, Flame, Sprout, Mountain } from "lucide-react";

interface WheelSegment {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    hoverColor: string;
}

const segments: WheelSegment[] = [
    {
        id: 0,
        title: "Higher Caffeine",
        description: "Robusta contains nearly twice the caffeine of Arabica, delivering a powerful energy boost.",
        icon: BatteryCharging,
        color: "#A67C52",
        hoverColor: "#B8956A",
    },
    {
        id: 1,
        title: "Bold Flavor Profile",
        description: "Rich, earthy, and intense with notes of dark chocolate and nuts.",
        icon: Flame,
        color: "#8B6914",
        hoverColor: "#A07D1C",
    },
    {
        id: 2,
        title: "Sustainable Crop",
        description: "More resilient to pests and diseases, requiring fewer chemicals to grow.",
        icon: Sprout,
        color: "#A67C52",
        hoverColor: "#B8956A",
    },
    {
        id: 3,
        title: "Diverse Origins",
        description: "Sourced from Vietnam, Uganda, India, and other renowned Robusta regions.",
        icon: Mountain,
        color: "#8B6914",
        hoverColor: "#A07D1C",
    },
];

const RobustaWheel = () => {
    const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
    const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

    const size = 420;
    const centerSize = 140;
    const center = size / 2;
    const outerRadius = size / 2 - 10;
    const innerRadius = centerSize / 2;
    const segmentAngle = 360 / segments.length;

    // Function to create SVG arc path
    const createArcPath = (
        startAngle: number,
        endAngle: number,
        outerR: number,
        innerR: number
    ) => {
        const startAngleRad = ((startAngle - 90) * Math.PI) / 180;
        const endAngleRad = ((endAngle - 90) * Math.PI) / 180;

        const x1 = center + outerR * Math.cos(startAngleRad);
        const y1 = center + outerR * Math.sin(startAngleRad);
        const x2 = center + outerR * Math.cos(endAngleRad);
        const y2 = center + outerR * Math.sin(endAngleRad);
        const x3 = center + innerR * Math.cos(endAngleRad);
        const y3 = center + innerR * Math.sin(endAngleRad);
        const x4 = center + innerR * Math.cos(startAngleRad);
        const y4 = center + innerR * Math.sin(startAngleRad);

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        return `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
    };

    // Function to get icon position
    const getIconPosition = (index: number, isHovered: boolean) => {
        const midAngle = index * segmentAngle + segmentAngle / 2 - 90;
        const midAngleRad = (midAngle * Math.PI) / 180;
        const iconRadius = (outerRadius + innerRadius) / 2;
        const hoverOffset = isHovered ? 8 : 0;

        return {
            x: center + (iconRadius + hoverOffset) * Math.cos(midAngleRad),
            y: center + (iconRadius + hoverOffset) * Math.sin(midAngleRad),
        };
    };

    // Function to get text position
    const getTextPosition = (index: number, isHovered: boolean) => {
        const midAngle = index * segmentAngle + segmentAngle / 2 - 90;
        const midAngleRad = (midAngle * Math.PI) / 180;
        const textRadius = (outerRadius + innerRadius) / 2 + 25;
        const hoverOffset = isHovered ? 8 : 0;

        return {
            x: center + (textRadius + hoverOffset) * Math.cos(midAngleRad),
            y: center + (textRadius + hoverOffset) * Math.sin(midAngleRad),
        };
    };

    const activeSegment = selectedSegment ?? hoveredSegment;

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            {/* Wheel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
            >
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="drop-shadow-2xl w-[320px] h-[320px] md:w-[420px] md:h-[420px]"
                >
                    {/* Segments */}
                    {segments.map((segment, index) => {
                        const startAngle = index * segmentAngle;
                        const endAngle = startAngle + segmentAngle;
                        const isHovered = hoveredSegment === index;
                        const isSelected = selectedSegment === index;
                        const isActive = isHovered || isSelected;

                        const iconPos = getIconPosition(index, isActive);
                        const Icon = segment.icon;

                        return (
                            <g key={segment.id}>
                                {/* Segment Path */}
                                <motion.path
                                    d={createArcPath(startAngle, endAngle, outerRadius, innerRadius)}
                                    fill={isActive ? segment.hoverColor : segment.color}
                                    stroke="hsl(var(--espresso))"
                                    strokeWidth="2"
                                    style={{ cursor: "pointer" }}
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.02 : 1,
                                        filter: isActive ? "brightness(1.1)" : "brightness(1)",
                                    }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    onMouseEnter={() => setHoveredSegment(index)}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                    onClick={() => setSelectedSegment(selectedSegment === index ? null : index)}
                                    className="origin-center"
                                />

                                {/* Icon */}
                                <motion.g
                                    initial={false}
                                    animate={{
                                        x: isActive ? (iconPos.x - center) * 0.04 : 0,
                                        y: isActive ? (iconPos.y - center) * 0.04 : 0,
                                    }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    style={{ pointerEvents: "none" }}
                                >
                                    <Icon
                                        x={iconPos.x - 18}
                                        y={iconPos.y - 35}
                                        width={36}
                                        height={36}
                                        className="text-white drop-shadow-md"
                                        style={{ color: "white" }}
                                    />
                                    {/* Title text */}
                                    <text
                                        x={iconPos.x}
                                        y={iconPos.y + 15}
                                        textAnchor="middle"
                                        className="font-display font-bold text-xs fill-white uppercase tracking-wider"
                                        style={{ fontSize: "10px" }}
                                    >
                                        {segment.title.split(" ").map((word, i) => (
                                            <tspan key={i} x={iconPos.x} dy={i === 0 ? 0 : 12}>
                                                {word}
                                            </tspan>
                                        ))}
                                    </text>
                                </motion.g>
                            </g>
                        );
                    })}

                    {/* Center Circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={innerRadius}
                        fill="hsl(var(--cream))"
                        stroke="hsl(var(--espresso))"
                        strokeWidth="3"
                    />

                    {/* Center Content */}
                    <g>
                        {/* Coffee Cup Icon */}
                        <Coffee
                            x={center - 24}
                            y={center - 35}
                            width={48}
                            height={48}
                            className="text-espresso"
                            style={{ color: "hsl(25, 20%, 16%)" }}
                        />
                        {/* Center Text */}
                        <text
                            x={center}
                            y={center + 25}
                            textAnchor="middle"
                            className="font-display font-bold fill-espresso"
                            style={{ fontSize: "12px", fill: "hsl(25, 20%, 16%)" }}
                        >
                            <tspan x={center} dy="0">PURE</tspan>
                            <tspan x={center} dy="14">ROBUSTA</tspan>
                        </text>
                    </g>
                </svg>
            </motion.div>

            {/* Description Panel */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-md text-center lg:text-left"
            >
                {activeSegment !== null ? (
                    <motion.div
                        key={activeSegment}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                            {(() => {
                                const Icon = segments[activeSegment].icon;
                                return (
                                    <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
                                        <Icon className="w-7 h-7 text-accent" />
                                    </div>
                                );
                            })()}
                            <h3 className="font-display text-2xl font-bold text-foreground">
                                {segments[activeSegment].title}
                            </h3>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {segments[activeSegment].description}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-muted-foreground text-lg"
                    >
                        <p className="italic">Hover over or click a segment to learn more about why we choose Robusta</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default RobustaWheel;
