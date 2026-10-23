import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { MobileHeroVideo } from "./MobileHeroVideo";

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "readyState", "get").mockReturnValue(4);
  vi.spyOn(HTMLMediaElement.prototype, "duration", "get").mockReturnValue(57);
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { configurable: true, value: false });
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
    Object.defineProperty(this, "paused", { configurable: true, value: true });
  });
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: false });
  Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
});

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function setup() {
  const view = render(<MobileHeroVideo videoUrl="/inline-4x5.mp4" fullscreenVideoUrl="/portrait-9x16.mp4" />);
  const [inline, portrait] = Array.from(view.container.querySelectorAll("video"));
  return { inline, portrait, frame: portrait.parentElement! };
}

it("opens the 9:16 edit at the inline time and returns to 4:5 at the updated time", async () => {
  const { inline, portrait } = setup();
  inline.currentTime = 14;
  inline.muted = true;
  await inline.play();
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(portrait.getAttribute("src")).toBe("/portrait-9x16.mp4");
  expect(portrait.currentTime).toBe(14);
  expect(inline.paused).toBe(true);
  expect(portrait.paused).toBe(false);
  portrait.currentTime = 23;
  portrait.muted = false;
  fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(inline.getAttribute("src")).toBe("/inline-4x5.mp4");
  expect(inline.currentTime).toBe(23);
  expect(inline.paused).toBe(false);
  expect(screen.getByRole("button", { name: "Mute video" })).toBeInTheDocument();
});

it("keeps a paused video paused through opening and closing", () => {
  const { inline, portrait } = setup();
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  expect(portrait.paused).toBe(true);
  fireEvent.keyDown(document, { key: "Escape" });
  expect(inline.paused).toBe(true);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("uses Safari native fullscreen on the preloaded portrait video and handles native exit", () => {
  const { inline, portrait } = setup();
  const enter = vi.fn();
  Object.defineProperty(portrait, "webkitEnterFullscreen", { value: enter });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  expect(enter).toHaveBeenCalledOnce();
  portrait.currentTime = 31;
  fireEvent(portrait, new Event("webkitendfullscreen"));
  expect(inline.currentTime).toBe(31);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("restores the inline player when the browser exits container fullscreen", async () => {
  const { inline, portrait, frame } = setup();
  const request = vi.fn().mockImplementation(async () => {
    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: frame });
  });
  Object.defineProperty(frame, "requestFullscreen", { value: request });
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: true });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  await waitFor(() => expect(request).toHaveBeenCalledOnce());
  portrait.currentTime = 27;
  Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
  fireEvent(document, new Event("fullscreenchange"));
  expect(inline.currentTime).toBe(27);
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("keeps a usable portrait player if native fullscreen is rejected", async () => {
  const { frame } = setup();
  const request = vi.fn().mockRejectedValue(new Error("denied"));
  Object.defineProperty(frame, "requestFullscreen", { value: request });
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: true });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  await waitFor(() => expect(request).toHaveBeenCalledOnce());
  expect(screen.getByRole("dialog")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }));
  expect(screen.queryByRole("dialog")).toBeNull();
});

it("closes the fullscreen container when native video controls leave a nested fullscreen video", async () => {
  const { inline, portrait, frame } = setup();
  Object.defineProperty(frame, "requestFullscreen", { value: vi.fn().mockResolvedValue(undefined) });
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, value: true });
  const exit = vi.fn().mockImplementation(async () => {
    Object.defineProperty(document, "fullscreenElement", { configurable: true, value: null });
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  Object.defineProperty(document, "exitFullscreen", { configurable: true, value: exit });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  Object.defineProperty(document, "fullscreenElement", { configurable: true, value: frame });
  fireEvent(document, new Event("fullscreenchange"));
  Object.defineProperty(document, "fullscreenElement", { configurable: true, value: portrait });
  fireEvent(document, new Event("fullscreenchange"));
  portrait.currentTime = 19;
  Object.defineProperty(document, "fullscreenElement", { configurable: true, value: frame });
  fireEvent(document, new Event("fullscreenchange"));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(exit).toHaveBeenCalledOnce();
  expect(inline.currentTime).toBe(19);
});

it("closes the overlay after Safari returns its native video to inline presentation", () => {
  const { portrait } = setup();
  Object.defineProperty(portrait, "webkitEnterFullscreen", { value: vi.fn() });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  Object.defineProperty(portrait, "webkitPresentationMode", { value: "inline" });
  fireEvent(portrait, new Event("webkitpresentationmodechanged"));
  expect(screen.queryByRole("dialog")).toBeNull();
});
