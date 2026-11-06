import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {GateLabTestDriver,main,label,hasControl,expect} from './GateLabLeafSupport';
@component
export class GateLabRecoveryScenario extends Scenario{
 async run():Promise<void>{
  const d=new GateLabTestDriver();await d.finish([1,0,1]);expect(main().getSnapshot().score).toBe(0);
  expect(label('GateLabPrompt')).toBe('You scored 0 / 3');
  await d.press('Replay');let s=main().getSnapshot();expect(s.phase).toBe('challenge');expect(s.questionNumber).toBe(1);expect(s.score).toBe(0);expect(s.feedback).toBeNull();expect(label('OutputValue')).toBe('?');
  await d.press('Reset');s=main().getSnapshot();expect(s.phase).toBe('welcome');expect(s.circuit.gate).toBe('AND');expect(s.circuit.a+s.circuit.b+s.score).toBe(0);expect(hasControl('Start')).toBe(true);expect(hasControl('PredictZero')).toBe(false);
  await d.finish();await d.press('Explore');s=main().getSnapshot();expect(s.phase).toBe('explore');expect(s.circuit.gate).toBe('AND');expect(s.circuit.a+s.circuit.b+s.score).toBe(0);expect(s.feedback).toBeNull();expect(label('GateLabPrompt')).toBe('AND · Try every input pair');
  await d.press('InputA');expect(main().getSnapshot().circuit.a).toBe(1);await d.press('Reset');expect(main().getSnapshot().phase).toBe('welcome');
  console.log('[GateLab LEAF recovery] wrong answers 0/3; replay fresh; reset welcome; Explore AND 00; single handler');
 }
}
