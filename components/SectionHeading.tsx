type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, description, align = "left" }: Props) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "text-left items-start";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignment}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl font-bold leading-tight tracking-tightest text-anthracite-700 sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-base leading-relaxed text-anthracite-500">{description}</p>}
    </div>
  );
}
