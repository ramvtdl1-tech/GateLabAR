/** Owns three local one-shot SFX and their volume. No domain/UI state. */
const CLICK=requireAsset('../GeneratedSFX/GateClick.wav') as AudioTrackAsset;
const REVEAL=requireAsset('../GeneratedSFX/GateReveal.wav') as AudioTrackAsset;
const FINISH=requireAsset('../GeneratedSFX/GateFinish.wav') as AudioTrackAsset;
@component
export class GateLabAudioController extends BaseScriptComponent {
  @ui.label('GateLab • subtle local feedback')
  @input @hint('One-shot cue volume. No background music.') @widget(new SliderWidget(0,0.6,0.05)) volume:number=0.22;
  private cues:AudioComponent[]=[];
  onAwake():void{this.createEvent('OnStartEvent').bind(()=>{
    [CLICK,REVEAL,FINISH].forEach(track=>{const cue=this.sceneObject.createComponent('Component.AudioComponent') as AudioComponent;cue.audioTrack=track;cue.volume=this.volume;cue.playbackMode=Audio.PlaybackMode.LowLatency;this.cues.push(cue);});
  });}
  public click():void{if(this.cues[0])this.cues[0].play(1);}
  public reveal():void{if(this.cues[1])this.cues[1].play(1);}
  public finish():void{if(this.cues[2])this.cues[2].play(1);}
}
