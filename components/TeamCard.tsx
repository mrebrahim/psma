import Image from "next/image";

export default function TeamCard({
  name,
  role,
  photo,
  compact = false,
}: {
  name: string;
  role: string;
  photo?: string;
  compact?: boolean;
}) {
  const ringSize = compact ? "w-16 h-16" : "w-20 h-20";
  const innerImg = compact ? 40 : 48;

  return (
    <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5 text-center">
      <div
        className={`${ringSize} rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white mx-auto mb-3 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-md`}
      >
        {photo ? (
          <Image
            src={photo}
            alt={name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src="/images/logo-shield.png"
            alt="بصمة شباب مصر"
            width={innerImg}
            height={innerImg}
            className={`${compact ? "w-10 h-10" : "w-12 h-12"} object-contain opacity-90`}
          />
        )}
      </div>
      <div className="font-extrabold text-[var(--color-primary)] text-sm mb-0.5">
        {name}
      </div>
      <div className="text-xs text-[var(--color-muted)] leading-snug">{role}</div>
    </div>
  );
}
