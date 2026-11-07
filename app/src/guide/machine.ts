/**
 * The guide's character state machine. One pure transition function, so every
 * animation the robot shows is derived from a single state and no two
 * animations can fight. Events that do not apply in the current state are
 * ignored (the state is returned unchanged), which removes race conditions
 * such as a late "speech ended" arriving after the visitor already spoke again.
 */
export type GuideState =
  | "sleeping"  // minimised / inactive
  | "greeting"  // just opened
  | "idle"
  | "listening" // microphone open
  | "thinking"  // working out an answer
  | "speaking"  // speech playing
  | "happy"     // answered
  | "confused"  // nothing verified to say, or nothing heard
  | "error";    // microphone, network or speech failure — shown, never hidden

export type AnswerKind = "answer" | "related" | "refused" | "none";

export type GuideEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "GREETED" }            // greeting shown (and, if voiced, finished)
  | { type: "LISTEN" }             // visitor pressed the microphone
  | { type: "HEARD" }              // recognition produced text
  | { type: "LISTEN_END" }         // recognition stopped without text
  | { type: "ASK" }                // a question was submitted (typed or spoken)
  | { type: "ANSWER"; kind: AnswerKind }
  | { type: "SPEECH_START" }
  | { type: "SPEECH_END" }
  | { type: "STOP" }               // visitor stopped speech
  | { type: "FAIL" }
  | { type: "SETTLE" };            // a short-lived expression returns to idle

const AWAKE: GuideState[] = ["greeting", "idle", "listening", "thinking", "speaking", "happy", "confused", "error"];
const READY: GuideState[] = ["greeting", "idle", "happy", "confused", "error", "speaking"];

export function next(state: GuideState, e: GuideEvent): GuideState {
  switch (e.type) {
    case "OPEN": return state === "sleeping" ? "greeting" : state;
    case "CLOSE": return "sleeping";
    case "GREETED": return state === "greeting" ? "idle" : state;
    case "LISTEN": return READY.includes(state) ? "listening" : state;
    case "HEARD": return state === "listening" ? "thinking" : state;
    case "LISTEN_END": return state === "listening" ? "confused" : state;
    case "ASK": return READY.includes(state) || state === "listening" ? "thinking" : state;
    case "ANSWER": return state === "thinking" ? (e.kind === "answer" || e.kind === "related" ? "happy" : "confused") : state;
    case "SPEECH_START": return ["greeting", "idle", "happy", "confused"].includes(state) ? "speaking" : state;
    case "SPEECH_END": return state === "speaking" ? "happy" : state;
    case "STOP": return state === "speaking" ? "idle" : state;
    case "FAIL": return AWAKE.includes(state) ? "error" : state;
    case "SETTLE": return ["happy", "confused", "error"].includes(state) ? "idle" : state;
  }
}

/** What the robot's face does in each state (also used as the accessible status text). */
export const STATE_LABEL: Record<GuideState, string> = {
  sleeping: "Resting",
  greeting: "Saying hello",
  idle: "Ready",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  happy: "Ready",
  confused: "Not sure",
  error: "Something went wrong",
};
