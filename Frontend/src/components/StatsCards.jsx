import { motion } from "framer-motion";

export default function StatsCards({ stats }) {
    const cards = [
        {
            title: "Total Messages",
            value: stats?.total || 0,
            icon: "📨",
            color: "from-blue-500 to-cyan-500",
        },
        {
            title: "Pending",
            value: stats?.pending || 0,
            icon: "⏳",
            color: "from-orange-500 to-yellow-500",
        },
        {
            title: "Resolved",
            value: stats?.resolved || 0,
            icon: "✅",
            color: "from-green-500 to-emerald-500",
        },
        {
            title: "Response Rate",
            value: `${stats?.responseRate || 0}%`,
            icon: "📊",
            color: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-400 text-sm font-medium mb-2">
                                {card.title}
                            </p>
                            <h3 className="text-3xl font-bold text-white">{card.value}</h3>
                        </div>
                        <div
                            className={`text-4xl bg-gradient-to-br ${card.color} bg-clip-text text-transparent`}
                        >
                            {card.icon}
                        </div>
                    </div>
                    <div
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${card.color} w-full`}
                    ></div>
                </motion.div>
            ))}
        </div>
    );
}
