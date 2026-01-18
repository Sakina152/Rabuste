import { motion } from "framer-motion";

const CoffeeLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-transparent">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* Saucer */}
        <motion.ellipse
          cx="100"
          cy="170"
          rx="70"
          ry="10"
          fill="#F5F5DC" // Cream
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Cup Handle */}
        <motion.path
          d="M150 90 C 170 90, 170 130, 150 130"
          fill="none"
          stroke="#F5F5DC"
          strokeWidth="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />

        {/* Cup Body Container (for masking) */}
        <defs>
          <clipPath id="cup-mask">
             <path d="M 50 70 L 150 70 C 150 70 145 150 100 150 C 55 150 50 70 50 70 Z" />
          </clipPath>
        </defs>

        {/* Cup Body Background (Empty) */}
        <motion.path
          d="M 50 70 L 150 70 C 150 70 145 150 100 150 C 55 150 50 70 50 70 Z"
          fill="#F5F5DC" // Cream
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Liquid (Coffee) */}
        <g clipPath="url(#cup-mask)">
          <motion.rect
            x="0"
            y="150" /* Start at bottom of cup */
            width="200"
            height="100"
            fill="#3C2A20" // Dark Brown
            initial={{ y: 0 }} 
            animate={{ y: -80 }} /* Move up to fill */
            transition={{ 
              duration: 2, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1
            }}
          />
        </g>

        {/* Inner Rim Highlight (Optional for depth) */}
        <motion.ellipse
          cx="100"
          cy="70"
          rx="50"
          ry="8"
          fill="#FFF8E7" // Lighters cream
          fillOpacity="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        
        {/* Steam Clouds */}
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d="M100 60 Q 110 50, 100 40 T 100 20"
            stroke="#E0E0E0" // Soft Grey
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 10, x: (i - 1) * 15 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              y: -20,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 1.5 + (i * 0.4),
              ease: "easeInOut"
            }}
          />
        ))}

      </svg>
    </div>
  );
};

export default CoffeeLoader;
