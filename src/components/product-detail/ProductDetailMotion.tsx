"use client";

import { type ReactNode, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, registerGsapPlugins, ScrollTrigger } from "@/lib/animation/gsap";
import { mediaQueries } from "@/lib/animation/breakpoints";

export function ProductDetailMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      const root = scope.current;
      if (!root) return;

      const reduceMotion = window.matchMedia(mediaQueries.reducedMotion).matches;
      const hero = root.querySelector<HTMLElement>("[data-product-hero]");
      const heroProduct = root.querySelector<HTMLElement>("[data-hero-product]");
      const heroTitle = root.querySelector<HTMLElement>("[data-hero-title]");
      const heroCopy = root.querySelector<HTMLElement>("[data-hero-copy]");
      const badge = root.querySelector<HTMLElement>("[data-product-badge]");
      const introStory = root.querySelector<HTMLElement>("[data-intro-story]");
      const introStage = root.querySelector<HTMLElement>("[data-intro-stage]");
      const introPrimaryLeft = root.querySelector<HTMLElement>('[data-intro-primary-half="left"]');
      const introPrimaryRight = root.querySelector<HTMLElement>('[data-intro-primary-half="right"]');
      const introSecondary = root.querySelector<HTMLElement>("[data-intro-secondary]");
      const combStage = root.querySelector<HTMLElement>("[data-comb-stage]");
      const combLeft = root.querySelector<HTMLElement>("[data-comb-left]");
      const combRight = root.querySelector<HTMLElement>("[data-comb-right]");
      const combFrameText = root.querySelector<HTMLElement>("[data-comb-frame-text]");
      const featureOverlaySection = root.querySelector<HTMLElement>("[data-feature-overlay-section]");
      const featureOverlayPanel = root.querySelector<HTMLElement>("[data-feature-overlay-panel]");
      const featureOverlayTrack = root.querySelector<HTMLElement>("[data-feature-overlay-track]");
      const featureOverlayItems = gsap.utils.toArray<HTMLElement>("[data-feature-overlay-item]", root);
      const scrollSnapIgnoreSections = gsap.utils.toArray<HTMLElement>(
        "[data-scroll-snap-ignore]:not([data-product-reveal])",
        root,
      );
      const footer = root.querySelector<HTMLElement>("[data-site-footer]");

      if (introStory) {
        ScrollTrigger.getAll()
          .filter((trigger) => trigger.trigger === introStory)
          .forEach((trigger) => trigger.kill(true));
        gsap.set(introStory, { clearProps: "position,top,left,width,height,transform" });
      }

      if (reduceMotion) {
        const revealedOnLoad = [heroProduct, heroTitle, heroCopy, badge, combLeft, combRight, combFrameText];
        gsap.set(revealedOnLoad, { clearProps: "all" });
        gsap.set(revealedOnLoad, { opacity: 1 });
        gsap.set(scrollSnapIgnoreSections, { clearProps: "all", opacity: 1 });
        gsap.set(featureOverlayItems, { opacity: (index) => (index === 0 ? 1 : 0) });
        gsap.set(introSecondary, { clearProps: "all", opacity: 1 });
        gsap.set(introPrimaryLeft, { clipPath: "polygon(-16% 0%, -16% 0%, -32% 100%, -32% 100%)" });
        gsap.set(introPrimaryRight, { clipPath: "polygon(116% 0%, 116% 0%, 100% 100%, 100% 100%)" });
        return;
      }

      const loader = document.querySelector<HTMLElement>(".initial-loader-overlay");
      const loaderDelay = loader && window.getComputedStyle(loader).visibility !== "hidden" ? 1.35 : 0.1;
      const isTabletUp = window.matchMedia(mediaQueries.tabletUp).matches;
      const heroProductRotate = isTabletUp ? -0.8 : -20;
      let heroReady = false;
      gsap.set(heroProduct, {
        opacity: 1,
        scale: 0.42,
        xPercent: 0,
        rotate: heroProductRotate,
        transformOrigin: "center",
      });
      gsap.set(heroTitle, {
        opacity: 1,
        scale: 2.2,
        y: 0,
        transformOrigin: "center",
      });
      if (heroCopy) {
        gsap.set(heroCopy, { opacity: 0, y: 18 });
      }
      gsap.set(badge, { opacity: 0, scale: 0.45, rotate: -28, transformOrigin: "center" });

      const heroIntro = gsap
        .timeline({ delay: loaderDelay, defaults: { ease: "power3.out" } })
        .to(heroProduct, { scale: 1, duration: 0.72 }, 0)
        .to(heroTitle, { scale: 1, duration: 0.72 }, 0)
        .to(badge, { opacity: 1, scale: 1, rotate: 0, duration: 0.68, ease: "back.out(1.8)" }, 0.16);

      if (heroCopy) {
        heroIntro.to(heroCopy, { opacity: 1, y: 0, duration: 0.5 }, 0.42);
      }

      heroIntro.call(() => {
        heroReady = true;
      });

      const responsiveMotion = gsap.matchMedia();
      const scrollSnapRevealTriggers = scrollSnapIgnoreSections.map((section) => {
        gsap.set(section, { opacity: 0, y: 24 });
        return ScrollTrigger.create({
          trigger: section,
          start: "top 82%",
          once: true,
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              clearProps: "transform",
            });
          },
        });
      });

      responsiveMotion.add(mediaQueries.tabletUp, () => {
        if (!hero || !heroProduct) {
          return;
        }

        const productXTo = gsap.quickTo(heroProduct, "x", { duration: 0.85, ease: "power3.out" });
        const productYTo = gsap.quickTo(heroProduct, "y", { duration: 0.85, ease: "power3.out" });
        const rotateTo = gsap.quickTo(heroProduct, "rotate", { duration: 0.85, ease: "power3.out" });

        function handlePointerMove(event: PointerEvent) {
          if (event.pointerType !== "mouse" || !heroReady) return;
          const rect = hero!.getBoundingClientRect();
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;
          productXTo(relX * 56);
          productYTo(relY * 36);
          rotateTo(-0.8 - relX * 2.8);
        }

        function handlePointerLeave() {
          productXTo(0);
          productYTo(0);
          rotateTo(-0.8);
        }

        hero.addEventListener("pointermove", handlePointerMove);
        hero.addEventListener("pointerleave", handlePointerLeave);

        return () => {
          hero.removeEventListener("pointermove", handlePointerMove);
          hero.removeEventListener("pointerleave", handlePointerLeave);
        };
      });

      if (
        introStory &&
        introStage &&
        introPrimaryLeft &&
        introPrimaryRight &&
        introSecondary
      ) {
        const introClosedLeft = "polygon(0% 0%, 59% 0%, 43% 100%, 0% 100%)";
        const introClosedRight = "polygon(59% 0%, 100% 0%, 100% 100%, 43% 100%)";
        gsap.set(introSecondary, { opacity: 1 });
        gsap.set(introPrimaryLeft, { clipPath: introClosedLeft });
        gsap.set(introPrimaryRight, { clipPath: introClosedRight });
        const introWipe = gsap.timeline({
          scrollTrigger: {
            trigger: introStory,
            start: isTabletUp ? "top 56%" : "top 60%",
            end: isTabletUp ? "top -18%" : "top -10%",
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        });
        introWipe
          .fromTo(
            introPrimaryLeft,
            { clipPath: introClosedLeft },
            {
              clipPath: "polygon(-16% 0%, -16% 0%, -32% 100%, -32% 100%)",
              duration: 1,
              ease: "power2.inOut",
            },
            0,
          )
          .fromTo(
            introPrimaryRight,
            { clipPath: introClosedRight },
            {
              clipPath: "polygon(116% 0%, 116% 0%, 100% 100%, 100% 100%)",
              duration: 1,
              ease: "power2.inOut",
            },
            0,
          );
      }

      let combCleanup: (() => void) | undefined;
      if (combStage && combLeft && combRight) {
        gsap.set(combLeft, {
          xPercent: -20,
          rotate: 35,
          opacity: 1,
          transformOrigin: "center center",
          willChange: "transform",
        });
        gsap.set(combRight, {
          xPercent: 20,
          rotate: -35,
          opacity: 1,
          transformOrigin: "center center",
          willChange: "transform",
        });

        const combTimeline = gsap.timeline({ paused: true });
        combTimeline
          .to(combLeft, { xPercent: 0, rotate: 0, duration: 1, ease: "none" }, 0)
          .to(combRight, { xPercent: 0, rotate: 0, duration: 1, ease: "none" }, 0);

        const combScrollTrigger = ScrollTrigger.create({
          trigger: combStage,
          start: "top bottom",
          end: "center center",
          scrub: true,
          animation: combTimeline,
          invalidateOnRefresh: true,
        });

        combCleanup = () => {
          combScrollTrigger.kill();
          combTimeline.kill();
        };
      }

      responsiveMotion.add(mediaQueries.tabletUp, () => {
        if (!badge || !footer) {
          return;
        }

        const badgeFooterTween = gsap.to(badge, {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: { trigger: footer, start: "top 90%", toggleActions: "play none none reverse" },
        });

        return () => {
          badgeFooterTween.scrollTrigger?.kill();
          badgeFooterTween.kill();
        };
      });

      let featureOverlayCleanup: (() => void) | undefined;
      if (featureOverlaySection && featureOverlayPanel && featureOverlayTrack && featureOverlayItems.length) {
        const getCenteredY = (virtualIndex: number) => {
          const lowerIndex = Math.floor(virtualIndex);
          const lastIndex = featureOverlayItems.length - 1;

          if (lowerIndex >= lastIndex) {
            const lastItem = featureOverlayItems[lastIndex];
            const previousItem = featureOverlayItems[Math.max(0, lastIndex - 1)];
            const lastCenter = lastItem.offsetTop + lastItem.offsetHeight / 2;
            const previousCenter = previousItem.offsetTop + previousItem.offsetHeight / 2;
            const step = Math.max(1, lastCenter - previousCenter);
            const extraProgress = virtualIndex - lastIndex;

            return featureOverlayPanel.offsetHeight / 2 - (lastCenter + step * extraProgress);
          }

          const upperIndex = Math.ceil(virtualIndex);
          const progress = virtualIndex - lowerIndex;
          const lowerItem = featureOverlayItems[lowerIndex];
          const upperItem = featureOverlayItems[upperIndex];
          const lowerCenter = lowerItem.offsetTop + lowerItem.offsetHeight / 2;
          const upperCenter = upperItem.offsetTop + upperItem.offsetHeight / 2;
          const itemCenter = lowerCenter + (upperCenter - lowerCenter) * progress;
          return featureOverlayPanel.offsetHeight / 2 - itemCenter;
        };

        const updateFeatureOverlay = (progress: number) => {
          const virtualIndex = progress * featureOverlayItems.length;
          gsap.set(featureOverlayTrack, { y: getCenteredY(virtualIndex) });
          featureOverlayItems.forEach((item, index) => {
            const distance = Math.abs(index - virtualIndex);
            gsap.set(item, { opacity: Math.max(0, 1 - distance) });
          });
        };
        gsap.set(featureOverlayTrack, { willChange: "transform" });
        gsap.set(featureOverlayItems, { willChange: "opacity" });
        updateFeatureOverlay(0);

        const featureOverlayScrollTrigger = ScrollTrigger.create({
          trigger: featureOverlaySection,
          start: "top top",
          end: "bottom top",
          invalidateOnRefresh: true,
          onRefresh: (self) => updateFeatureOverlay(self.progress),
          onUpdate: (self) => updateFeatureOverlay(self.progress),
        });

        featureOverlayCleanup = () => {
          featureOverlayScrollTrigger.kill();
        };
      }

      return () => {
        combCleanup?.();
        featureOverlayCleanup?.();
        scrollSnapRevealTriggers.forEach((trigger) => trigger.kill());
        responsiveMotion.revert();
      };
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
