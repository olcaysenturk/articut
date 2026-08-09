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
      const heroIntroScene = root.querySelector<HTMLElement>("[data-hero-intro-scene]");
      const heroIntroTrack = root.querySelector<HTMLElement>("[data-hero-intro-track]");
      const introStory = root.querySelector<HTMLElement>("[data-intro-story]");
      const introStage = root.querySelector<HTMLElement>("[data-intro-stage]");
      const introPrimaryLeft = root.querySelector<HTMLElement>('[data-intro-primary-half="left"]');
      const introPrimaryRight = root.querySelector<HTMLElement>('[data-intro-primary-half="right"]');
      const introSecondary = root.querySelector<HTMLElement>("[data-intro-secondary]");
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-product-reveal]", root);
      const combLeft = root.querySelector<HTMLElement>("[data-comb-left]");
      const combRight = root.querySelector<HTMLElement>("[data-comb-right]");
      const featureLines = gsap.utils.toArray<HTMLElement>("[data-feature-line]", root);
      const footer = root.querySelector<HTMLElement>("[data-site-footer]");

      if (heroIntroScene || introStory) {
        ScrollTrigger.getAll()
          .filter((trigger) => trigger.trigger === heroIntroScene || trigger.trigger === introStory)
          .forEach((trigger) => trigger.kill(true));
        gsap.set(introStory, { clearProps: "position,top,left,width,height,transform" });
        gsap.set(heroIntroTrack, { clearProps: "transform" });
      }

      if (reduceMotion) {
        gsap.set([heroProduct, heroTitle, heroCopy, badge, revealItems, combLeft, combRight, featureLines], {
          clearProps: "all",
          opacity: 1,
        });
        gsap.set(introSecondary, { clearProps: "all", opacity: 1 });
        gsap.set(introPrimaryLeft, { clipPath: "polygon(-16% 0%, -16% 0%, -32% 100%, -32% 100%)" });
        gsap.set(introPrimaryRight, { clipPath: "polygon(116% 0%, 116% 0%, 100% 100%, 100% 100%)" });
        return;
      }

      const loader = document.querySelector<HTMLElement>(".initial-loader-overlay");
      const loaderDelay = loader && window.getComputedStyle(loader).visibility !== "hidden" ? 1.35 : 0.1;
      let heroReady = false;
      gsap.set(heroProduct, {
        opacity: 1,
        scale: 0.42,
        xPercent: 0,
        rotate: -0.8,
        transformOrigin: "center",
      });
      gsap.set(heroTitle, {
        opacity: 1,
        scale: 2.2,
        y: 0,
        transformOrigin: "center",
      });
      gsap.set(heroCopy, { opacity: 0, y: 18 });
      gsap.set(badge, { opacity: 0, scale: 0.45, rotate: -28, transformOrigin: "center" });

      gsap
        .timeline({ delay: loaderDelay, defaults: { ease: "power3.out" } })
        .to(heroProduct, { scale: 1, duration: 0.72 }, 0)
        .to(heroTitle, { scale: 1, duration: 0.72 }, 0)
        .to(badge, { opacity: 1, scale: 1, rotate: 0, duration: 0.68, ease: "back.out(1.8)" }, 0.16)
        .to(heroCopy, { opacity: 1, y: 0, duration: 0.5 }, 0.42)
        .call(() => {
          heroReady = true;
        });

      const responsiveMotion = gsap.matchMedia();
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
        heroIntroScene &&
        heroIntroTrack &&
        introStory &&
        introStage &&
        introPrimaryLeft &&
        introPrimaryRight &&
        introSecondary
      ) {
        gsap.set(introSecondary, { opacity: 1 });
        const introWipe = gsap.timeline({
          scrollTrigger: {
            trigger: heroIntroScene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });
        introWipe
          .to(
            heroIntroTrack,
            {
              y: () => -introStage.offsetHeight,
              duration: 0.5,
              ease: "none",
            },
            0,
          )
          .fromTo(
            introPrimaryLeft,
            { clipPath: "polygon(0% 0%, 59% 0%, 43% 100%, 0% 100%)" },
            {
              clipPath: "polygon(-16% 0%, -16% 0%, -32% 100%, -32% 100%)",
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.5,
          )
          .fromTo(
            introPrimaryRight,
            { clipPath: "polygon(59% 0%, 100% 0%, 100% 100%, 43% 100%)" },
            {
              clipPath: "polygon(116% 0%, 116% 0%, 100% 100%, 100% 100%)",
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.5,
          );
      }

      revealItems.forEach((item) => {
        gsap.from(item, {
          y: 54,
          opacity: 0,
          scale: 0.985,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 84%", toggleActions: "play none none reverse" },
        });
      });

      if (combLeft && combRight) {
        gsap.from(combLeft, {
          xPercent: -20,
          rotation: 215,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: combLeft, start: "top 85%", toggleActions: "play none none reverse" },
        });
        gsap.from(combRight, {
          xPercent: 20,
          rotation: 145,
          opacity: 0,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: { trigger: combRight, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }

      if (badge && footer) {
        gsap.to(badge, {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
          scrollTrigger: { trigger: footer, start: "top 90%", toggleActions: "play none none reverse" },
        });
      }

      if (featureLines.length) {
        gsap.from(featureLines, {
          y: 24,
          opacity: 0,
          duration: 0.62,
          stagger: 0.32,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featureLines[0].parentElement,
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        });
      }

      return () => responsiveMotion.revert();
    },
    { scope },
  );

  return <div ref={scope}>{children}</div>;
}
