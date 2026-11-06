import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

// Test the actual pure Lens state source without changing Lens Studio's CommonJS config.
const stateSource = readFileSync(new URL('../Assets/Scripts/GateLabState.ts', import.meta.url), 'utf8');
const stateJavaScript = stripTypeScriptTypes(stateSource);
const { evaluateGate, GateLabModel } = await import(
  'data:text/javascript;base64,' + Buffer.from(stateJavaScript).toString('base64')
);

const truthTables = {
  AND: [0, 0, 0, 1],
  OR: [0, 1, 1, 1],
  XOR: [0, 1, 1, 0],
};
const inputPairs = [[0, 0], [0, 1], [1, 0], [1, 1]];
const answers = [0, 1, 0];

function act(model, action) {
  const result = model.dispatch(action);
  assert.equal(result.ok, true, JSON.stringify(action));
  return result.state;
}

function beginChallenge(model = new GateLabModel()) {
  act(model, { type: 'start' });
  act(model, { type: 'startChallenge' });
  return model;
}

function complete(model, predictions = answers) {
  for (const value of predictions) {
    act(model, { type: 'predict', value });
    act(model, { type: 'next' });
  }
  return model.snapshot();
}

function rejectWithoutChange(model, action, error = 'invalid_phase') {
  const before = model.snapshot();
  const result = model.dispatch(action);
  assert.equal(result.ok, false);
  assert.equal(result.error, error);
  assert.deepEqual(result.state, before);
  assert.deepEqual(model.snapshot(), before);
}

test('all twelve truth table rows match the specification', () => {
  for (const [gate, expected] of Object.entries(truthTables)) {
    inputPairs.forEach(([a, b], index) => {
      assert.equal(evaluateGate(gate, a, b), expected[index], `${gate}(${a}, ${b})`);
    });
  }
});

test('gate evaluation rejects nonbinary and unknown values without coercion', () => {
  for (const invalid of [-1, 2, true, false, '1', null, undefined, NaN, {}, []]) {
    assert.throws(() => evaluateGate('AND', invalid, 0), TypeError);
    assert.throws(() => evaluateGate('OR', 0, invalid), TypeError);
  }
  for (const gate of ['NAND', 'and', '', null, undefined, {}, '__proto__']) {
    assert.throws(() => evaluateGate(gate, 0, 1), TypeError);
  }
});

test('welcome requires Start; explore toggles both inputs and cycles all gates', () => {
  const model = new GateLabModel();
  assert.equal(model.snapshot().phase, 'welcome');
  for (const action of [
    { type: 'toggleInput', input: 'A' }, { type: 'cycleGate' },
    { type: 'startChallenge' }, { type: 'predict', value: 0 },
    { type: 'next' }, { type: 'replay' }, { type: 'explore' },
  ]) rejectWithoutChange(model, action);
  act(model, { type: 'start' });
  rejectWithoutChange(model, { type: 'start' });
  // Visit each input pair through the actual interaction API for every gate.
  for (const gate of ['AND', 'OR', 'XOR']) {
    for (const input of [null, 'B', 'A', 'B', 'A']) {
      if (input) act(model, { type: 'toggleInput', input });
      const { circuit } = model.snapshot();
      assert.equal(circuit.gate, gate);
      assert.equal(circuit.output, evaluateGate(gate, circuit.a, circuit.b));
      assert.match(circuit.rule, new RegExp(gate));
    }
    act(model, { type: 'cycleGate' });
  }
  assert.equal(model.snapshot().circuit.gate, 'AND');
});

test('challenge freezes controls, conceals answers, and accepts one prediction per question', () => {
  const model = beginChallenge();
  const questions = [['AND', 1, 0], ['OR', 0, 1], ['XOR', 1, 1]];
  for (let index = 0; index < questions.length; index++) {
    const question = model.snapshot();
    assert.equal(question.phase, 'challenge');
    assert.equal(question.questionNumber, index + 1);
    assert.equal(question.totalQuestions, 3);
    assert.equal(question.circuit.output, null);
    assert.equal(question.feedback, null);
    assert.deepEqual([question.circuit.gate, question.circuit.a, question.circuit.b], questions[index]);
    for (const action of [
      { type: 'toggleInput', input: 'A' }, { type: 'toggleInput', input: 'B' },
      { type: 'cycleGate' }, { type: 'next' }, { type: 'startChallenge' },
      { type: 'replay' }, { type: 'explore' }, { type: 'start' },
    ]) rejectWithoutChange(model, action);
    const state = act(model, { type: 'predict', value: answers[index] });
    assert.equal(state.phase, 'feedback');
    assert.equal(state.score, index + 1);
    assert.equal(state.circuit.output, answers[index]);
    assert.equal(state.feedback.correct, true);
    assert.equal(state.feedback.message, 'Correct');
    assert.match(state.feedback.explanation, new RegExp(`Y=${answers[index]}`));
    rejectWithoutChange(model, { type: 'predict', value: answers[index] });
    rejectWithoutChange(model, { type: 'predict', value: 1 - answers[index] });
    rejectWithoutChange(model, { type: 'toggleInput', input: 'A' });
    rejectWithoutChange(model, { type: 'cycleGate' });
    act(model, { type: 'next' });
    rejectWithoutChange(model, { type: 'next' });
  }
  const end = model.snapshot();
  assert.equal(end.phase, 'finish');
  assert.equal(end.score, 3);
  assert.equal(end.feedback, null);
  assert.equal(end.questionNumber, null);
});

test('every possible prediction sequence produces its exact score and useful feedback', () => {
  for (let sequence = 0; sequence < 8; sequence++) {
    const model = beginChallenge();
    const predictions = [0, 1, 2].map(index => (sequence >> index) & 1);
    let expectedScore = 0;
    predictions.forEach((value, index) => {
      const state = act(model, { type: 'predict', value });
      expectedScore += value === answers[index] ? 1 : 0;
      assert.equal(state.score, expectedScore);
      assert.equal(state.feedback.prediction, value);
      assert.equal(state.feedback.expected, answers[index]);
      assert.equal(state.feedback.correct, value === answers[index]);
      assert.equal(state.feedback.message, value === answers[index] ? 'Correct' : 'Try the rule');
      assert.match(state.feedback.explanation, /With A=[01] and B=[01], Y=[01]\./);
      act(model, { type: 'next' });
    });
    assert.equal(model.snapshot().score, expectedScore);
    assert.equal(model.snapshot().phase, 'finish');
  }
});

test('replay and return to explore discard completed-round feedback and progress', () => {
  const model = beginChallenge();
  complete(model);
  let state = act(model, { type: 'replay' });
  assert.equal(state.phase, 'challenge');
  assert.equal(state.questionNumber, 1);
  assert.equal(state.score, 0);
  assert.equal(state.feedback, null);
  assert.equal(state.circuit.output, null);
  complete(model, [1, 0, 1]);
  state = act(model, { type: 'explore' });
  assert.equal(state.phase, 'explore');
  assert.equal(state.score, 0);
  assert.equal(state.questionNumber, null);
  assert.equal(state.feedback, null);
  assert.deepEqual([state.circuit.gate, state.circuit.a, state.circuit.b, state.circuit.output], ['AND', 0, 0, 0]);
  state = act(model, { type: 'startChallenge' });
  assert.equal(state.score, 0);
  assert.equal(state.feedback, null);
});

test('Reset restores the initial Welcome state from every phase and is idempotent', () => {
  const initial = new GateLabModel().snapshot();
  for (const phase of ['welcome', 'explore', 'challenge', 'feedback', 'finish']) {
    const model = new GateLabModel();
    if (phase !== 'welcome') {
      act(model, { type: 'start' });
      act(model, { type: 'toggleInput', input: 'A' });
      act(model, { type: 'cycleGate' });
    }
    if (['challenge', 'feedback', 'finish'].includes(phase)) act(model, { type: 'startChallenge' });
    if (phase === 'feedback') act(model, { type: 'predict', value: 0 });
    if (phase === 'finish') complete(model);
    assert.equal(model.snapshot().phase, phase);
    assert.deepEqual(act(model, { type: 'reset' }), initial);
    assert.deepEqual(act(model, { type: 'reset' }), initial);
  }
});

test('snapshots and feedback are deeply frozen, detached from later state and session-local', () => {
  const model = beginChallenge();
  const question = model.snapshot();
  const response = model.dispatch({ type: 'predict', value: 0 });
  const answered = response.state;
  for (const object of [question, question.circuit, response, answered, answered.circuit, answered.feedback]) {
    assert.equal(Object.isFrozen(object), true);
  }
  assert.throws(() => { question.circuit.a = 0; }, TypeError);
  assert.throws(() => { answered.feedback.correct = false; }, TypeError);
  act(model, { type: 'next' });
  assert.equal(question.phase, 'challenge');
  assert.equal(question.circuit.output, null);
  assert.equal(answered.phase, 'feedback');
  assert.equal(answered.feedback.correct, true);
  assert.equal(model.snapshot().feedback, null);
  assert.equal(new GateLabModel().snapshot().phase, 'welcome');
});

test('malformed/unknown actions fail explicitly and preserve state', () => {
  const model = beginChallenge();
  for (const invalid of [null, undefined, false, 1, 'reset', []]) {
    rejectWithoutChange(model, invalid, 'invalid_argument');
  }
  for (const action of [{}, { type: 'skip' }, { type: '__proto__' }]) {
    rejectWithoutChange(model, action, 'unknown_action');
  }
  for (const value of [true, '0', 2, null, undefined]) {
    rejectWithoutChange(model, { type: 'predict', value }, 'invalid_argument');
  }
  rejectWithoutChange(model, { type: 'toggleInput', input: 'C' }, 'invalid_argument');
  assert.equal(act(model, { type: 'predict', value: 0 }).score, 1);
});
