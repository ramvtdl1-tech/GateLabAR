/** Orchestrates one domain model and passive views. Authored world anchor never follows
 * the camera. References are wired in VirtualScene Phase B; no scene/UI construction here. */
import {GateLabModel,Snapshot,Action} from './GateLabState';
import {GateLabHeaderUI} from './GateLabHeaderUI';
import {GateLabNodeUI} from './GateLabNodeUI';
import {GateLabJourneyUI,JourneyView} from './GateLabJourneyUI';
import {GateLabCircuitMesh} from './GateLabCircuitMesh';
import {GateLabAudioController} from './GateLabAudioController';
import {GATELAB_MANIFEST} from './GateLabSceneContracts';
@component
export class GateLabMain extends BaseScriptComponent {
  @ui.label('GateLab AR • session and learning journey')
  @ui.group_start('References')
  @input @hint('Passive title/mode view.') header!:GateLabHeaderUI;
  @input @hint('Passive contextual actions view.') journey!:GateLabJourneyUI;
  @input @hint('A node view.') nodeA!:GateLabNodeUI;
  @input @hint('B node view.') nodeB!:GateLabNodeUI;
  @input @hint('Gate selector view.') gateNode!:GateLabNodeUI;
  @input @hint('Output readout view.') outputNode!:GateLabNodeUI;
  @input @hint('Authored circuit root; hides circuit on Welcome.') circuitRoot!:SceneObject;
  @input @hint('Procedural paths presenter.') circuitMesh!:GateLabCircuitMesh;
  @input @hint('Local one-shot sound controller.') audio!:GateLabAudioController;
  @ui.group_end
  @ui.group_start('Settings')
  @input @hint('Draw native collider wireframes for inspecting the UIKit hit targets.') debugColliders:boolean=false;
  @ui.group_end
  private model=new GateLabModel();
  public getSnapshot():Snapshot{return this.model.snapshot();}
  onAwake():void {
    this.createEvent('OnStartEvent').bind(()=>{
      if(!this.header||!this.journey||!this.nodeA||!this.nodeB||!this.gateNode||!this.outputNode||!this.circuitRoot||!this.circuitMesh||!this.audio){console.error('[GateLab] Required scene references missing. Complete Phase B wiring.');return;}
      this.nodeA.onPress.add(()=>this.act({type:'toggleInput',input:'A'}));
      this.nodeB.onPress.add(()=>this.act({type:'toggleInput',input:'B'}));
      this.gateNode.onPress.add(()=>this.act({type:'cycleGate'}));
      this.journey.onIntent.add(name=>this.handle(name));
      const ready=this.createEvent('DelayedCallbackEvent');ready.bind(()=>{this.render();this.setColliderDebugAll(this.sceneObject,this.debugColliders);console.log('[GateLab] Ready: '+GATELAB_MANIFEST.tier);});ready.reset(0.25);
    });
  }
  private handle(name:string):void {
    const actions:{[key:string]:Action}={Start:{type:'start'},StartChallenge:{type:'startChallenge'},PredictZero:{type:'predict',value:0},PredictOne:{type:'predict',value:1},NextQuestion:{type:'next'},Replay:{type:'replay'},Explore:{type:'explore'},Reset:{type:'reset'}};
    const action=actions[name];if(action)this.act(action);
  }
  private act(action:Action):void {
    const result=this.model.dispatch(action);if(!result.ok)return;
    if(result.state.phase==='finish'&&action.type==='next')this.audio.finish();
    else if(action.type==='predict')this.audio.reveal();else this.audio.click();
    this.render();console.log('[GateLab state] '+JSON.stringify(result.state));
  }
  private render():void {
    const s=this.model.snapshot(),c=s.circuit;
    this.circuitRoot.enabled=s.phase!=='welcome';
    const active=new vec4(0.35,0.98,1,1),inactive=new vec4(0.82,0.73,1,1);
    this.nodeA.setNode(String(c.a),s.phase==='explore',c.a===1?active:inactive);
    this.nodeB.setNode(String(c.b),s.phase==='explore',c.b===1?active:inactive);
    this.gateNode.setNode(c.gate,s.phase==='explore',inactive);
    this.outputNode.setNode(c.output===null?'?':String(c.output),false,c.output===1?active:inactive);
    this.circuitMesh.setSignals(c.a,c.b,c.output);
    const title=s.phase==='welcome'?'LOGIC YOU CAN REACH':s.phase==='explore'?'EXPLORE · INPUT → GATE → OUTPUT':s.phase==='finish'?'CHECK COMPLETE':`QUESTION ${s.questionNumber} / 3 · SCORE ${s.score}`;
    this.header.setMode(title);
    this.journey.show(this.view(s));
  }
  private view(s:Snapshot):JourneyView {
    const reset={name:'Reset',label:'Reset',width:7};
    switch(s.phase){
      case 'welcome':return {key:'welcome',title:'Make signals make sense',body:'Pinch an input. Follow its signal through a gate.\nThen predict the output in three quick questions.',buttons:[{name:'Start',label:'Start',width:12}]};
      case 'explore':return {key:'explore',title:`${s.circuit.gate} · Try every input pair`,body:s.circuit.rule+'\nPinch A / B to toggle. Pinch the gate to switch.',buttons:[{name:'StartChallenge',label:'Prediction check',width:17},reset]};
      case 'challenge':return {key:'challenge',title:`Predict Y · Question ${s.questionNumber} of 3`,body:'Follow A and B into the gate.\nChoose 0 or 1. The output stays hidden.',buttons:[{name:'PredictZero',label:'Y = 0',width:10},{name:'PredictOne',label:'Y = 1',width:10},reset]};
      case 'feedback':return {key:'feedback',title:`${s.feedback.correct?'Correct':'Try the rule'} · Y = ${s.feedback.expected}`,body:s.circuit.rule+`\nA=${s.circuit.a}, B=${s.circuit.b} → Y=${s.feedback.expected}. You chose ${s.feedback.prediction}.`,buttons:[{name:'NextQuestion',label:s.questionNumber===3?'See score':'Next',width:12},reset]};
      case 'finish':return {key:'finish',title:`You scored ${s.score} / 3`,body:'Replay a fresh round, or explore all 12 cases.\nThe circuit stays in your room.',buttons:[{name:'Replay',label:'Replay',width:10},{name:'Explore',label:'Explore',width:10},reset]};
    }
  }
  private setColliderDebugAll(root:SceneObject,enabled:boolean):void {
    const colliders=root.getComponents('Physics.ColliderComponent') as ColliderComponent[];
    colliders.forEach(c=>c.debugDrawEnabled=enabled);
    for(let i=0;i<root.getChildrenCount();i++)this.setColliderDebugAll(root.getChild(i),enabled);
  }
}
