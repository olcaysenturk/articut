import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { VideoFullscreenButton } from "./VideoFullscreenButton";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setup(lockPortrait = false) {
  Object.defineProperty(document, "fullscreenEnabled", { configurable: true, get: () => false });
  const view = render(<section data-video-frame><video /><VideoFullscreenButton lockPortrait={lockPortrait} /></section>);
  return view.container.querySelector("section")!;
}

it("opens the video container and requests portrait orientation", async () => {
  const frame = setup(true);
  const request = vi.fn().mockResolvedValue(undefined);
  const lock = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(frame, "requestFullscreen", { value: request });
  vi.spyOn(document, "fullscreenEnabled", "get").mockReturnValue(true);
  vi.stubGlobal("screen", { orientation: { lock } });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  await waitFor(() => expect(lock).toHaveBeenCalledWith("portrait"));
  expect(request).toHaveBeenCalledOnce();
});

it("keeps the screen orientation unchanged on desktop", async () => {
  const frame = setup();
  const request = vi.fn().mockResolvedValue(undefined);
  const lock = vi.fn();
  Object.defineProperty(frame, "requestFullscreen", { value: request });
  vi.spyOn(document, "fullscreenEnabled", "get").mockReturnValue(true);
  vi.stubGlobal("screen", { orientation: { lock } });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  await waitFor(() => expect(request).toHaveBeenCalledOnce());
  expect(lock).not.toHaveBeenCalled();
});

it("uses Safari's native video fullscreen when container fullscreen is unavailable", () => {
  const frame = setup();
  const enter = vi.fn();
  Object.defineProperty(frame.querySelector("video"), "webkitEnterFullscreen", { value: enter });
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  expect(enter).toHaveBeenCalledOnce();
});

it("reports a rejected fullscreen request", async () => {
  const frame = setup();
  Object.defineProperty(frame, "requestFullscreen", { value: vi.fn().mockRejectedValue(new Error("denied")) });
  vi.spyOn(document, "fullscreenEnabled", "get").mockReturnValue(true);
  fireEvent.click(screen.getByRole("button", { name: "Enter fullscreen" }));
  expect(await screen.findByRole("status")).toHaveTextContent("Could not open fullscreen");
});
