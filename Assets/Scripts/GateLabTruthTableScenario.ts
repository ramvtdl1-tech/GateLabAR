import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {GateLabTestDriver,main,label,expect,sleep,findSceneObjectByName} from './GateLabLeafSupport';
@component
export class GateLabTruthTableScenario extends Scenario{
 async run():Promise<void>{
  const d=new GateLabTestDriver();await d.explore();
  const anchor=findSceneObjectByName('GateLabAR').getTransform().getWorldPosition();
  const pairs=[[0,0],[1,0],[1,1],[0,1]];
  const fixtures=[{gate:'AND',y:[0,0,1,0]},{gate:'OR',y:[0,1,1,1]},{gate:'XOR',y:[0,1,0,1]}];
  let count=0;
  for(const f of fixtures){for(let i=0;i<4;i++){
   if(i===1||i===3)await d.press('InputA');if(i===2)await d.press('InputB');
   const s=main().getSnapshot();expect(s.phase).toBe('explore');expect(s.circuit.gate).toBe(f.gate);
   expect(s.circuit.a).toBe(pairs[i][0]);expect(s.circuit.b).toBe(pairs[i][1]);expect(s.circuit.output).toBe(f.y[i]);
   expect(label('InputAValue')).toBe(String(pairs[i][0]));expect(label('InputBValue')).toBe(String(pairs[i][1]));
   expect(label('GateSelectorValue')).toBe(f.gate);expect(label('OutputValue')).toBe(String(f.y[i]));
   for(const [name,value] of [['ASignalPathPulse',pairs[i][0]],['BSignalPathPulse',pairs[i][1]],['YSignalPathPulse',f.y[i]]] as [string,number][])expect(findSceneObjectByName(name).enabled).toBe(value===1);
   console.log('[GateLab LEAF truth] '+f.gate+' '+pairs[i].join('')+' -> '+f.y[i]);count++;
  }if(f.gate!=='XOR'){await d.press('InputB');await d.press('GateSelector');}}
  expect(count).toBe(12);
  const bead=findSceneObjectByName('BSignalPathPulse').getTransform();const before=bead.getWorldPosition();await sleep(300);expect(bead.getWorldPosition().distance(before)>0.1).toBe(true);
  expect(findSceneObjectByName('GateLabAR').getTransform().getWorldPosition().distance(anchor)).toBeCloseTo(0,4);
  await d.press('Reset');expect(main().getSnapshot().phase).toBe('welcome');
 }
}
