import {Scenario} from 'Leaf.lspkg/Scenarios/scenario/Scenario';
import {createIKInteractor} from 'Leaf.lspkg/Interactors/interactor/ik/visualizer/BitmojiAvatar';
import {GateLabTestDriver,main,expect,sleep,findInteractablesByName} from './GateLabLeafSupport';
@component
export class GateLabIKScenario extends Scenario{
 async run():Promise<void>{
  const d=new GateLabTestDriver();await d.welcome();
  const ik=createIKInteractor({avatar:{debugOverlay:false}});const target=findInteractablesByName('Start',undefined,true)[0];
  const indirect=ik.right.isIndirect(target);console.log('[GateLab LEAF IK] Start indirect='+indirect+'; world UI is at 110cm; this does not prove device hand tracking');
  await ik.trigger(target);await sleep(1000);expect(main().getSnapshot().phase).toBe('explore');
 }
}
