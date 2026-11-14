import { describe, it, expect } from "vitest";
import { wantFrame, clampDt, IDLE_STOP_MS, ACTIVE_MS, AMBIENT_FPS } from "~/universe/motion";

describe("on-demand rendering", () => {
  const t = 100_000;
  it("draws nothing when nothing needs to move", () => {
    expect(wantFrame([], t, t, 0)).toBeNull();
    expect(wantFrame([null, null], t, t, 0)).toBeNull();
  });
  it("draws every frame while something actually moves, even when idle", () => {
    expect(wantFrame(["fast"], t, t - IDLE_STOP_MS * 2, 0)).toBe("fast");
    expect(wantFrame(["ambient", "fast"], t, t, t)).toBe("fast");
  });
  it("decorative motion: full rate just after input, capped afterwards, stopped when idle", () => {
    expect(wantFrame(["ambient"], t, t - ACTIVE_MS / 2, t)).toBe("fast");
    expect(wantFrame(["ambient"], t, t - ACTIVE_MS * 2, t - 1)).toBeNull();
    expect(wantFrame(["ambient"], t, t - ACTIVE_MS * 2, t - 1000 / AMBIENT_FPS)).toBe("ambient");
    expect(wantFrame(["ambient"], t, t - IDLE_STOP_MS - 1, 0)).toBeNull();
  });
  it("clamps long frame gaps so motion never jumps after an idle pause", () => {
    expect(clampDt(0.016)).toBe(0.016);
    expect(clampDt(60)).toBe(0.1);
  });
});
