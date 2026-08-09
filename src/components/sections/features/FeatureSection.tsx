"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins } from "@/lib/animation/gsap";
import { mediaQueries } from "@/lib/animation/breakpoints";

type FeatureImageBase = {
  src: string;
  alt: string;
  className: string;
  sizes: string;
};

type FeatureImage = FeatureImageBase &
  (
    | { fill: true; width?: never; height?: never }
    | { fill?: false; width: number; height: number }
  );

type SequenceConfig = {
  path: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  indexPadding?: number;
  startAt?: number;
  duration?: number;
  canvasClassName: string;
};

type FeatureSectionAnimation = {
  animateHeading?: boolean;
  animateDetails?: boolean;
  animateProductImage?: boolean;
  productImageStartAt?: number;
  productImageDuration?: number;
};

type FeatureSectionBaseConfig = {
  sectionId?: string;
  title: string | string[];
  titleAriaLabel?: string;
  headingLevel?: 1 | 2;
  headingClassName: string;
  sectionClassName: string;
  nodeId?: string;
  snapSection?: boolean;
  backgroundImage?: FeatureImage;
  productImage?: FeatureImage;
  productImageContainerClassName?: string;
  features: string[];
  featuresClassName: string;
  featureItemClassName?: string;
  showFeatureBullets?: boolean;
  bulletClassName?: string;
  cta: {
    href: string;
    label: string;
    className: string;
    backgroundClassName: string;
    contentClassName: string;
  };
  detailsClassName?: string;
  animation?: FeatureSectionAnimation;
};

export type FeatureSectionConfig = FeatureSectionBaseConfig &
  (
    | { enablePngSequence: true; sequence: SequenceConfig }
    | { enablePngSequence?: false; sequence?: never }
  );

function ConfiguredImage({ image }: { image: FeatureImage }) {
  if (image.fill) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={image.sizes}
        className={image.className}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      sizes={image.sizes}
      className={image.className}
    />
  );
}

function sequenceFrameUrl(path: string, index: number, padding: number) {
  return path.replace("{index}", String(index).padStart(padding, "0"));
}

export function FeatureSection({ config }: { config: FeatureSectionConfig }) {
  const {
    animation,
    enablePngSequence = false,
    sequence,
  } = config;
  const stageRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const productImageRef = useRef<HTMLDivElement>(null);
  const buttonPillRef = useRef<HTMLSpanElement>(null);
  const buttonContentRef = useRef<HTMLAnchorElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  const drawFrame = useCallback(
    (index: number) => {
      if (!enablePngSequence || !sequence || !canvasRef.current) {
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const images = imagesRef.current;
      let frame = images[index];
      for (let i = index; i >= 0 && !frame; i -= 1) {
        frame = images[i];
      }
      if (!frame) return;

      ctx.clearRect(0, 0, sequence.frameWidth, sequence.frameHeight);
      ctx.drawImage(frame, 0, 0, sequence.frameWidth, sequence.frameHeight);
    },
    [enablePngSequence, sequence],
  );

  useEffect(() => {
    if (!enablePngSequence || !sequence) {
      imagesRef.current = [];
      return;
    }

    const sequenceConfig = sequence;
    const media = window.matchMedia(mediaQueries.tabletUp);
    let cancelled = false;
    let loaded = false;

    function preloadFrames() {
      if (!media.matches || loaded || cancelled) return;
      loaded = true;

      const images: (HTMLImageElement | null)[] = new Array(sequenceConfig.frameCount).fill(null);
      imagesRef.current = images;

      for (let i = 0; i < sequenceConfig.frameCount; i += 1) {
        const image = new window.Image();
        image.src = sequenceFrameUrl(
          sequenceConfig.path,
          i,
          sequenceConfig.indexPadding ?? 3,
        );
        image.onload = () => {
          if (cancelled) return;
          images[i] = image;
          if (i === currentFrameRef.current) {
            drawFrame(currentFrameRef.current);
          }
        };
      }
    }

    preloadFrames();
    media.addEventListener("change", preloadFrames);

    return () => {
      cancelled = true;
      media.removeEventListener("change", preloadFrames);
      imagesRef.current = [];
    };
  }, [drawFrame, enablePngSequence, sequence]);

  useGSAP(
    () => {
      registerGsapPlugins();

      const stage = stageRef.current;
      const headingLines = Array.from(
        headingRef.current?.querySelectorAll<HTMLElement>("[data-heading-line]") ?? [],
      );
      const featureItems = gsap.utils.toArray<HTMLElement>("[data-feature-item]", stage);
      const animateHeading = animation?.animateHeading ?? false;
      const animateDetails = animation?.animateDetails ?? false;
      const animateProductImage = animation?.animateProductImage ?? false;
      const hasTimelineAnimation = enablePngSequence || animateHeading || animateDetails;
      const hasAnimation = hasTimelineAnimation || animateProductImage;

      if (!stage || !hasAnimation) {
        return;
      }

      if (window.matchMedia(mediaQueries.reducedMotion).matches) {
        gsap.set(headingRef.current, { lineHeight: 1 });
        gsap.set(headingLines, { opacity: 1, y: 0 });
        gsap.set([buttonPillRef.current, buttonContentRef.current, featureItems], {
          clearProps: "all",
        });
        gsap.set(productImageRef.current, { clearProps: "opacity,scale" });
        if (enablePngSequence && sequence) {
          currentFrameRef.current = sequence.frameCount - 1;
          drawFrame(currentFrameRef.current);
        }
        return;
      }

      if (animateHeading) {
        gsap.set(headingRef.current, { lineHeight: 1.32, willChange: "line-height" });
        gsap.set(headingLines, {
          opacity: (index) => Math.min(0.2 + index * 0.2, 0.6),
          y: (index) => 140 - index * 15,
          willChange: "transform, opacity",
        });
      }

      if (animateDetails) {
        gsap.set(buttonPillRef.current, {
          scaleX: 0,
          opacity: 0,
          transformOrigin: "center center",
        });
        gsap.set(buttonContentRef.current, { opacity: 0 });
        gsap.set(featureItems, { opacity: 0, y: 12 });
      }

      if (animateProductImage) {
        gsap.set(productImageRef.current, {
          opacity: 0,
          scale: 0.96,
          transformOrigin: "center center",
        });
      }

      const timeline = gsap.timeline({ paused: true });
      const sequenceStart = sequence?.startAt ?? 0.4;
      const sequenceDuration = sequence?.duration ?? 3.3;
      const productImageStart = animation?.productImageStartAt ?? (animateHeading ? 1.05 : 0);
      const productImageDuration = animation?.productImageDuration ?? 0.8;

      if (animateHeading) {
        timeline
          .to(headingRef.current, { lineHeight: 1, duration: 1.05, ease: "sine.out" }, 0)
          .to(
            headingLines,
            { opacity: 1, y: 0, duration: 0.9, ease: "sine.out", stagger: 0.04 },
            0,
          );
      }

      const playhead = { frame: 0 };
      if (enablePngSequence && sequence) {
        currentFrameRef.current = 0;
        drawFrame(0);
        timeline.to(
          playhead,
          {
            frame: sequence.frameCount - 1,
            duration: sequenceDuration,
            ease: "none",
            onUpdate: () => {
              currentFrameRef.current = Math.round(playhead.frame);
              drawFrame(currentFrameRef.current);
            },
          },
          sequenceStart,
        );
      }

      if (animateDetails && buttonPillRef.current && buttonContentRef.current) {
        const detailsStart = enablePngSequence
          ? sequenceStart + sequenceDuration
          : animateProductImage
            ? productImageStart + productImageDuration
            : 0;
        timeline
          .to(
            buttonPillRef.current,
            { scaleX: 1, opacity: 1, duration: 0.7, ease: "power3.out" },
            detailsStart,
          )
          .to(
            buttonContentRef.current,
            { opacity: 1, duration: 0.3, ease: "power2.out" },
            detailsStart + 0.2,
          )
          .to(
            featureItems,
            { opacity: 1, y: 0, duration: 0.42, stagger: 0.21, ease: "power2.out" },
            detailsStart + 0.9,
          );
      }


      const productImageEntrance = animateProductImage
        ? gsap
            .timeline({ paused: true })
            .to(
              productImageRef.current,
              {
                opacity: 1,
                scale: 1,
                duration: productImageDuration,
                ease: "power2.out",
              },
              productImageStart,
            )
        : null;
      let hasPlayedProductImageEntrance = false;
      let previousRatio = 0;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const enteredThreshold = entry.intersectionRatio >= 0.8 && previousRatio < 0.8;
          previousRatio = entry.intersectionRatio;

          if (enteredThreshold) {
            if (hasTimelineAnimation) {
              timeline.restart();
            }
            if (productImageEntrance && !hasPlayedProductImageEntrance) {
              hasPlayedProductImageEntrance = true;
              productImageEntrance.play(0);
            }
            return;
          }

          if (!entry.isIntersecting && hasTimelineAnimation) {
            timeline.pause(0);
            if (enablePngSequence) {
              playhead.frame = 0;
              currentFrameRef.current = 0;
              drawFrame(0);
            }
          }
        },
        { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] },
      );
      observer.observe(stage);

      return () => {
        observer.disconnect();
        timeline.kill();
        productImageEntrance?.kill();
      };
    },
    {
      scope: stageRef,
      dependencies: [animation, drawFrame, enablePngSequence, sequence],
    },
  );

  const Heading = config.headingLevel === 2 ? "h2" : "h1";
  const title = Array.isArray(config.title) ? config.title : [config.title];

  return (
    <section
      ref={stageRef}
      id={config.sectionId}
      className={config.sectionClassName}
      data-node-id={config.nodeId}
      data-snap-section={config.snapSection || undefined}
    >
      {config.backgroundImage ? <ConfiguredImage image={config.backgroundImage} /> : null}

      <Heading
        ref={headingRef}
        aria-label={config.titleAriaLabel}
        className={config.headingClassName}
      >
        {title.map((line) => (
          <span
            key={line}
            aria-hidden={Array.isArray(config.title) || undefined}
            data-heading-line={Array.isArray(config.title) || undefined}
            className={Array.isArray(config.title) ? "block" : undefined}
          >
            {line}
          </span>
        ))}
      </Heading>

      {enablePngSequence && sequence ? (
        <canvas
          ref={canvasRef}
          width={sequence.frameWidth}
          height={sequence.frameHeight}
          className={sequence.canvasClassName}
        />
      ) : config.productImage ? (
        config.productImageContainerClassName ? (
          <div ref={productImageRef} className={config.productImageContainerClassName}>
            <ConfiguredImage image={config.productImage} />
          </div>
        ) : (
          <ConfiguredImage image={config.productImage} />
        )
      ) : null}

      <div
        className={`pointer-events-none absolute inset-0 ${config.detailsClassName ?? "z-30"}`}
      >
        <ul className={config.featuresClassName}>
          {config.features.map((feature) => (
            <li
              key={feature}
              data-feature-item
              className={config.featureItemClassName}
            >
              {config.showFeatureBullets ? (
                <span aria-hidden className={config.bulletClassName} />
              ) : null}
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <div className={config.cta.className}>
          <span
            ref={buttonPillRef}
            aria-hidden
            className={config.cta.backgroundClassName}
          />
          <Link
            ref={buttonContentRef}
            href={config.cta.href}
            className={config.cta.contentClassName}
          >
            {config.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
