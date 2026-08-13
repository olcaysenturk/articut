"use client";

import { useEffect, useRef } from "react";

function buildArcTable(rx: number, ry: number, steps: number) {
  const angles: number[] = [];
  const cum = [0];
  let prevX = 0;
  let prevY = 0;

  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * 360;
    const radians = (angle * Math.PI) / 180;
    const x = rx * Math.cos(radians);
    const y = ry * Math.sin(radians);
    angles.push(angle);

    if (index > 0) {
      const dx = x - prevX;
      const dy = y - prevY;
      cum.push(cum[index - 1] + Math.sqrt(dx * dx + dy * dy));
    }

    prevX = x;
    prevY = y;
  }

  return { angles, cum, total: cum[cum.length - 1] };
}

function angleAtArcLength(table: ReturnType<typeof buildArcTable>, length: number) {
  let normalized = length % table.total;
  if (normalized < 0) normalized += table.total;

  for (let index = 1; index < table.cum.length; index += 1) {
    if (table.cum[index] >= normalized) {
      const segment = table.cum[index] - table.cum[index - 1] || 1;
      const progress = (normalized - table.cum[index - 1]) / segment;
      return table.angles[index - 1] + progress * (table.angles[index] - table.angles[index - 1]);
    }
  }

  return table.angles[table.angles.length - 1];
}

function curvatureRadius(rx: number, ry: number, angle: number) {
  const sine = Math.sin(angle);
  const cosine = Math.cos(angle);
  const numerator = (rx * rx * sine * sine + ry * ry * cosine * cosine) ** 1.5;
  return numerator / (rx * ry);
}

export function CombCalloutFrame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let animationFrame = 0;
    let lastTime = performance.now();
    let phaseDeg = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
    };

    const draw = (time: number) => {
      const ratio = window.devicePixelRatio || 1;
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      phaseDeg += 16 * delta;

      const width = canvas.width;
      const height = canvas.height;
      context.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const isMobile = window.innerWidth < 768;
      const strokeWidth = (isMobile ? 2 : 3) * ratio;
      const outerBase = 12 * ratio;
      const innerBase = (isMobile ? 12 : 23) * ratio;
      const safeInset = strokeWidth * 1.5 + outerBase + 1 * ratio;
      const rx = Math.max(1, width / 2 - safeInset);
      const ry = Math.max(1, height / 2 - safeInset);
      const spikes = isMobile ? 14 : 19;
      const clampFactor = 1;
      const table = buildArcTable(rx, ry, 240);
      const totalPoints = spikes * 2;
      const phaseArc = (phaseDeg / 360) * table.total;

      context.beginPath();
      for (let index = 0; index <= totalPoints; index += 1) {
        const pointIndex = index % totalPoints;
        const length = (pointIndex / totalPoints) * table.total + phaseArc;
        const angleDeg = angleAtArcLength(table, length);
        const angle = (angleDeg * Math.PI) / 180;
        const px = rx * Math.cos(angle);
        const py = ry * Math.sin(angle);
        const tx = -rx * Math.sin(angle);
        const ty = ry * Math.cos(angle);
        const tangentLength = Math.sqrt(tx * tx + ty * ty) || 1;
        let nx = ty / tangentLength;
        let ny = -tx / tangentLength;

        if (nx * px + ny * py < 0) {
          nx = -nx;
          ny = -ny;
        }

        const radiusLimit = curvatureRadius(rx, ry, angle) * clampFactor;
        const baseAmplitude = pointIndex % 2 === 0 ? outerBase : -innerBase;
        const amplitude =
          baseAmplitude >= 0
            ? Math.min(baseAmplitude, radiusLimit)
            : -Math.min(-baseAmplitude, radiusLimit);
        const x = cx + px + nx * amplitude;
        const y = cy + py + ny * amplitude;

        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }

      context.closePath();
      context.lineWidth = strokeWidth;
      context.strokeStyle = "#E04D26";
      context.lineJoin = "miter";
      context.miterLimit = isMobile ? 4 : 8;
      context.stroke();

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
