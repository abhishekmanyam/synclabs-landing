import SpotlightCard from "./SpotlightCard";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string;
  spotlightColor?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  gradient,
  spotlightColor = "rgba(43, 248, 212, 0.12)",
}: FeatureCardProps) {
  return (
    <SpotlightCard
      className="gradient-border p-6 lg:p-8 transition-all duration-300 group rounded-2xl"
      spotlightColor={spotlightColor}
    >
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-[#d0e8f2]/50 leading-relaxed">{description}</p>
    </SpotlightCard>
  );
}
