export const easeStandard = [0.22, 1, 0.36, 1] as const;

export const standardTransition = {
  duration: 0.4,
  ease: easeStandard,
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const drawerVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export const accordionVariants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: "auto", opacity: 1 },
};

export const tapScale = { scale: 0.96 };
