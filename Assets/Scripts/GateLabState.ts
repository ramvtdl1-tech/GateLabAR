/** GateLab domain state owner. Adapted from logic/gatelab.mts for Lens TypeScript.
 * Pure: no scene, UI, audio, or platform APIs. Private TS fields replace ECMAScript # fields. */
export type Bit = 0 | 1;
export type Gate = "AND" | "OR" | "XOR";
export type Phase = "welcome" | "explore" | "challenge" | "feedback" | "finish";

const GATES: readonly Gate[] = Object.freeze(["AND", "OR", "XOR"]);
const QUESTIONS: readonly Readonly<{ gate: Gate; a: Bit; b: Bit }>[] = Object.freeze([
  Object.freeze({ gate: "AND", a: 1, b: 0 }),
  Object.freeze({ gate: "OR", a: 0, b: 1 }),
  Object.freeze({ gate: "XOR", a: 1, b: 1 }),
]);

const RULES: Readonly<Record<Gate, string>> = Object.freeze({
  AND: "AND outputs 1 only when both inputs are 1.",
  OR: "OR outputs 1 when at least one input is 1.",
  XOR: "XOR outputs 1 when the inputs are different.",
});

function isBit(value: unknown): value is Bit {
  return value === 0 || value === 1;
}

function isGate(value: unknown): value is Gate {
  return value === "AND" || value === "OR" || value === "XOR";
}

/** Reject invalid inputs rather than applying JavaScript's truthiness coercion. */
export function evaluateGate(gate: Gate, a: Bit, b: Bit): Bit {
  if (!isGate(gate) || !isBit(a) || !isBit(b)) {
    throw new TypeError("Expected AND, OR or XOR and two binary values (0 or 1).");
  }
  switch (gate) {
    case "AND": return a === 1 && b === 1 ? 1 : 0;
    case "OR": return a === 1 || b === 1 ? 1 : 0;
    case "XOR": return a !== b ? 1 : 0;
  }
}

export type Action =
  | { type: "start" }
  | { type: "toggleInput"; input: "A" | "B" }
  | { type: "cycleGate" }
  | { type: "startChallenge" }
  | { type: "predict"; value: Bit }
  | { type: "next" }
  | { type: "replay" }
  | { type: "explore" }
  | { type: "reset" };

export type Feedback = Readonly<{
  prediction: Bit;
  expected: Bit;
  correct: boolean;
  message: "Correct" | "Try the rule";
  explanation: string;
}>;

export type Snapshot = Readonly<{
  phase: Phase;
  circuit: Readonly<{
    gate: Gate;
    a: Bit;
    b: Bit;
    /** null conceals the answer until a prediction is accepted. */
    output: Bit | null;
    rule: string;
  }>;
  questionNumber: number | null;
  totalQuestions: number;
  score: number;
  feedback: Feedback | null;
}>;

export type ActionResult =
  | Readonly<{ ok: true; state: Snapshot }>
  | Readonly<{
      ok: false;
      error: "invalid_phase" | "invalid_argument" | "unknown_action";
      state: Snapshot;
    }>;

type State = {
  phase: Phase;
  gate: Gate;
  a: Bit;
  b: Bit;
  questionIndex: number | null;
  score: number;
  feedback: Feedback | null;
};

function initialState(phase: "welcome" | "explore" = "welcome"): State {
  return { phase, gate: "AND", a: 0, b: 0, questionIndex: null, score: 0, feedback: null };
}

/**
 * A session owns its state. dispatch is synchronous: a repeated pinch/Next event
 * sees the phase changed by the first event and cannot score/advance twice.
 */
export class GateLabModel {
  private state: State = initialState();

  snapshot(): Snapshot {
    const state = this.state;
    return Object.freeze({
      phase: state.phase,
      circuit: Object.freeze({
        gate: state.gate,
        a: state.a,
        b: state.b,
        output: state.phase === "challenge" ? null : evaluateGate(state.gate, state.a, state.b),
        rule: RULES[state.gate],
      }),
      questionNumber: state.questionIndex === null ? null : state.questionIndex + 1,
      totalQuestions: QUESTIONS.length,
      score: state.score,
      feedback: state.feedback,
    });
  }

  private result(error?: "invalid_phase" | "invalid_argument" | "unknown_action"): ActionResult {
    return error
      ? Object.freeze({ ok: false, error, state: this.snapshot() })
      : Object.freeze({ ok: true, state: this.snapshot() });
  }

  private loadQuestion(index: number): void {
    const question = QUESTIONS[index];
    this.state = {
      phase: "challenge", ...question, questionIndex: index,
      score: this.state.score, feedback: null,
    };
  }

  dispatch(action: Action): ActionResult {
    // Defensive validation also supports callers from untyped JS event code.
    if (typeof action !== "object" || action === null || Array.isArray(action)) {
      return this.result("invalid_argument");
    }
    const state = this.state;
    switch (action.type) {
      case "reset":
        this.state = initialState();
        break;
      case "start":
        if (state.phase !== "welcome") return this.result("invalid_phase");
        this.state = initialState("explore");
        break;
      case "toggleInput":
        if (action.input !== "A" && action.input !== "B") return this.result("invalid_argument");
        if (state.phase !== "explore") return this.result("invalid_phase");
        if (action.input === "A") state.a = state.a === 0 ? 1 : 0;
        else state.b = state.b === 0 ? 1 : 0;
        break;
      case "cycleGate":
        if (state.phase !== "explore") return this.result("invalid_phase");
        state.gate = GATES[(GATES.indexOf(state.gate) + 1) % GATES.length];
        break;
      case "startChallenge":
        if (state.phase !== "explore") return this.result("invalid_phase");
        state.score = 0;
        this.loadQuestion(0);
        break;
      case "predict": {
        if (!isBit(action.value)) return this.result("invalid_argument");
        if (state.phase !== "challenge") return this.result("invalid_phase");
        const expected = evaluateGate(state.gate, state.a, state.b);
        const correct = action.value === expected;
        state.feedback = Object.freeze({
          prediction: action.value,
          expected,
          correct,
          message: correct ? "Correct" : "Try the rule",
          explanation: `${RULES[state.gate]} With A=${state.a} and B=${state.b}, Y=${expected}.`,
        });
        state.score += correct ? 1 : 0;
        state.phase = "feedback";
        break;
      }
      case "next":
        if (state.phase !== "feedback") return this.result("invalid_phase");
        if (state.questionIndex === QUESTIONS.length - 1) {
          state.phase = "finish";
          state.feedback = null;
          state.questionIndex = null;
        } else {
          // Only feedback has a question index; it is set by loadQuestion.
          this.loadQuestion(state.questionIndex! + 1);
        }
        break;
      case "replay":
        if (state.phase !== "finish") return this.result("invalid_phase");
        state.score = 0;
        this.loadQuestion(0);
        break;
      case "explore":
        if (state.phase !== "finish") return this.result("invalid_phase");
        this.state = initialState("explore");
        break;
      default:
        return this.result("unknown_action");
    }
    return this.result();
  }
}
