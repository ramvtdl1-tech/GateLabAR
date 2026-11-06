import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {GateLabTestDriver,main,label,hasControl,expect,sleep} from './GateLabLeafSupport';
@component
export class GateLabChallengeScenario extends Scenario{
 async run():Promise<void>{
  const d=new GateLabTestDriver();await d.explore();await d.press('StartChallenge');
  const questions=[{gate:'AND',a:1,b:0,y:0},{gate:'OR',a:0,b:1,y:1},{gate:'XOR',a:1,b:1,y:0}];
  for(let i=0;i<3;i++){
   const q=questions[i],before=main().getSnapshot();expect(before.phase).toBe('challenge');expect(before.questionNumber).toBe(i+1);
   expect(before.circuit.gate).toBe(q.gate);expect(before.circuit.a).toBe(q.a);expect(before.circuit.b).toBe(q.b);
   expect(before.circuit.output).toBeNull();expect(label('OutputValue')).toBe('?');
   for(const name of ['InputA','InputB','GateSelector','NextQuestion'])expect(hasControl(name)).toBe(false);
   await d.press(q.y===0?'PredictZero':'PredictOne');
   const after=main().getSnapshot();expect(after.phase).toBe('feedback');expect(after.score-before.score).toBe(1);expect(after.feedback.correct).toBe(true);
   expect(after.circuit.output).toBe(q.y);expect(label('OutputValue')).toBe(String(q.y));expect(label('GateLabExplanation').includes('You chose '+q.y)).toBe(true);
   expect(hasControl('PredictZero')).toBe(false);expect(hasControl('PredictOne')).toBe(false);await sleep(400);expect(main().getSnapshot().score).toBe(after.score);
   await d.press('NextQuestion');
  }
  const s=main().getSnapshot();expect(s.phase).toBe('finish');expect(s.score).toBe(3);expect(s.feedback).toBeNull();
  expect(label('GateLabPrompt')).toBe('You scored 3 / 3');expect(hasControl('NextQuestion')).toBe(false);
  console.log('[GateLab LEAF challenge] 3 hidden answers; 3 single-score feedback steps; final 3/3');
 }
}
