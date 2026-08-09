"use client";

import { useEffect } from "react";
import { mediaQueries } from "@/lib/animation/breakpoints";

const SECTION_SELECTOR = "[data-snap-section]";
const TRANSITION_DURATION = 900;
const GESTURE_IDLE_DELAY = 160;

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export function ScrollSnapNav() {
  useEffect(() => {
    if (!window.matchMedia(mediaQueries.tabletUp).matches) {
      return;
    }
    const reduceMotion = window.matchMedia(mediaQueries.reducedMotion).matches;
    let gestureLocked = false;
    let activeDirection = 0;
    let activeOriginIndex = 0;
    let activeTargetIndex = 0;
    let transitionStartedAt = 0;
    let lastWheelAt = Number.NEGATIVE_INFINITY;
    let unlockTimer: number | undefined;
    let animationFrame: number | undefined;

    function getSections() {
      return Array.from(document.querySelectorAll<HTMLElement>(SECTION_SELECTOR));
    }

    function getClosestSectionIndex(sections: HTMLElement[]) {
      return sections.reduce((closestIndex, section, index) => {
        const closestDistance = Math.abs(sections[closestIndex].getBoundingClientRect().top);
        const distance = Math.abs(section.getBoundingClientRect().top);
        return distance < closestDistance ? index : closestIndex;
      }, 0);
    }

    function scheduleUnlock() {
      window.clearTimeout(unlockTimer);
      const remaining = Math.max(0, TRANSITION_DURATION - (performance.now() - transitionStartedAt));
      unlockTimer = window.setTimeout(
        () => {
          activeDirection = 0;
          gestureLocked = false;
        },
        Math.max(GESTURE_IDLE_DELAY, remaining),
      );
    }

    function animateTo(section: HTMLElement) {
      const startY = window.scrollY;
      const targetY = Math.round(section.getBoundingClientRect().top + startY);

      if (reduceMotion) {
        window.scrollTo({ top: targetY, behavior: "instant" });
        return;
      }

      const distance = targetY - startY;
      const startedAt = performance.now();

      function step(now: number) {
        const progress = Math.min((now - startedAt) / TRANSITION_DURATION, 1);
        window.scrollTo({ top: startY + distance * easeOutCubic(progress), behavior: "instant" });

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
          return;
        }

        window.scrollTo({ top: targetY, behavior: "instant" });
        animationFrame = undefined;
      }

      animationFrame = window.requestAnimationFrame(step);
    }

    function handleWheel(event: WheelEvent) {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-scroll-snap-ignore]")
      ) {
        return;
      }

      const sections = getSections();
      if (sections.length === 0 || event.deltaY === 0) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const wheelAt = performance.now();
      const isNewGesture = wheelAt - lastWheelAt > GESTURE_IDLE_DELAY;
      lastWheelAt = wheelAt;

      if (!gestureLocked) {
        const currentIndex = getClosestSectionIndex(sections);
        const targetIndex = Math.max(0, Math.min(currentIndex + direction, sections.length - 1));

        if (targetIndex === currentIndex) {
          // No snap target in this direction (e.g. just past the last tracked
          // section) — release control so native scroll can continue instead
          // of swallowing the event and freezing the page.
          activeDirection = 0;
          return;
        }

        event.preventDefault();
        gestureLocked = true;
        activeDirection = direction;
        activeOriginIndex = currentIndex;
        activeTargetIndex = targetIndex;
        transitionStartedAt = performance.now();
        scheduleUnlock();
        animateTo(sections[targetIndex]);
        return;
      }

      event.preventDefault();

      if (direction !== activeDirection) {
        window.clearTimeout(unlockTimer);

        if (animationFrame !== undefined) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = undefined;

          const returnIndex = activeOriginIndex;
          activeOriginIndex = activeTargetIndex;
          activeTargetIndex = returnIndex;
          activeDirection = direction;
          transitionStartedAt = performance.now();
          scheduleUnlock();
          animateTo(sections[returnIndex]);
          return;
        }

        gestureLocked = false;
      } else if (!isNewGesture) {
        scheduleUnlock();
        return;
      } else {
        window.clearTimeout(unlockTimer);
        window.cancelAnimationFrame(animationFrame ?? 0);
        animationFrame = undefined;

        const activeTarget = sections[activeTargetIndex];
        const activeTargetY = Math.round(activeTarget.getBoundingClientRect().top + window.scrollY);
        window.scrollTo({ top: activeTargetY, behavior: "instant" });
        gestureLocked = false;
      }

      const currentIndex = getClosestSectionIndex(sections);
      const targetIndex = Math.max(0, Math.min(currentIndex + direction, sections.length - 1));

      if (targetIndex === currentIndex) {
        activeDirection = 0;
        gestureLocked = false;
        return;
      }

      gestureLocked = true;
      activeDirection = direction;
      activeOriginIndex = currentIndex;
      activeTargetIndex = targetIndex;
      transitionStartedAt = performance.now();
      scheduleUnlock();
      animateTo(sections[targetIndex]);
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.clearTimeout(unlockTimer);
      window.cancelAnimationFrame(animationFrame ?? 0);
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null;
}
