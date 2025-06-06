import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StatCardProps {
    card: {
        customIndex: number;
        title: string;
        value: string | number;
        description: string;
        gradient: string;
        icon: React.ReactNode;
        trend?: "up" | "down" | null;
        hasError: boolean;
    };
}
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.4,
            ease: "easeOut",
        },
    }),
    hover: {
        y: -5,
        boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 15,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.2 }
    }
};

const iconVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delay: 0.2 }
    }
};

const numberVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delay: 0.3 }
    }
};
const StatCard = ({ card }: StatCardProps) => (
    <motion.div
        custom={card.customIndex}
        initial="hidden"
        animate="visible"
        exit="exit"
        whileHover={!card.hasError ? "hover" : undefined}
        variants={cardVariants}
        className="w-full"
        layout
    >
        <Card className={`overflow-hidden  ${card.hasError ? "border-red-200" : ""}`}>
            <CardHeader
                className={`bg-gradient-to-r ${card.gradient} p-4 pb-2 flex flex-row justify-between items-center`}
            >
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                </CardTitle>
                <motion.div
                    className={`rounded-full p-1 ${card.hasError
                        ? "bg-red-100/50 text-red-600"
                        : card.trend === "up"
                            ? "bg-green-100/50 text-green-600"
                            : "bg-red-100/50 text-red-600"
                        }`}
                    variants={iconVariants}
                >
                    {card.icon}
                </motion.div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <motion.div
                    className="text-2xl font-bold flex items-end gap-1"
                    variants={numberVariants}
                >
                    {card.value}
                    {!card.hasError && card.trend && (
                        <span
                            className={`text-xs mb-1 ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}
                        >
                            {card.trend === "up" ? (
                                <ChevronUp className="h-3 w-3" />
                            ) : (
                                <ChevronDown className="h-3 w-3" />
                            )}
                        </span>
                    )}
                </motion.div>
                <motion.p
                    className={`text-xs ${card.hasError ? "text-red-500" : "text-muted-foreground"} mt-1`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {card.description}
                </motion.p>
            </CardContent>
        </Card>
    </motion.div>
);


export default StatCard;