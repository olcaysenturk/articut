const RIBBON_WORDS = ["set", "place", "split", "cut"];

export function RibbonMarquee({
  reverse = false,
  vertical = false,
  className = "",
}: {
  reverse?: boolean;
  vertical?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none overflow-hidden text-[#e04d26] ${className}`}
    >
      <div
        className={`ribbon-marquee-track h-full ${reverse ? "ribbon-marquee-reverse" : ""} ${
          vertical ? "ribbon-marquee-vertical" : ""
        }`}
      >
        {[0, 1].map((group) => (
          <div key={group} className="ribbon-marquee-group h-full">
            {[0, 1, 2].flatMap((repeat) =>
              RIBBON_WORDS.map((word) => (
                <span key={`${repeat}-${word}`} className="ribbon-marquee-word">
                  <span>{word}</span>
                  <span className="ribbon-marquee-separator">
                    <span className="ribbon-marquee-mark" />
                  </span>
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
