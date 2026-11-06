/** Passive contextual instructions and semantic action bar. Receives strings/actions;
 * caches mode panes and switches them on a later frame so SIK targets remain valid. */
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event";
import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate";
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button";
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout";
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem";
import {FlexAlign,FlexAlignSelf,FlexDirection,FlexJustify} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes";

type TextRole = "Title2"|"Headline1"|"Body"|"Button"|"Caption";
const TYPE_SCALE:Record<TextRole,{size:number;weight:number}>={Title2:{size:93,weight:700},Headline1:{size:54,weight:700},Body:{size:39,weight:500},Button:{size:39,weight:500},Caption:{size:38,weight:500}};
function applyTextRole(t:Text,role:TextRole,scale:number=1):void{t.size=TYPE_SCALE[role].size*scale;(t as Text & {weight?:number}).weight=TYPE_SCALE[role].weight;}
const LAYOUT_Z_LIFT=0.02;

export type JourneyView={key:string;title:string;body:string;buttons:{name:string;label:string;width:number}[]};
@component
export class GateLabJourneyUI extends BaseScriptComponent {
  @ui.label('GateLab • contextual learning actions')
  @ui.group_start('Settings')
  @input @hint('Width in centimeters.') @widget(new SliderWidget(36,46,1)) widthCm:number=44;
  @input @hint('Typography scale.') @widget(new SliderWidget(1,1.3,0.05)) textScale:number=1;
  @ui.group_end
  private intent=new Event<string>();public get onIntent(){return this.intent.publicApi();}
  private actionLabels:{[key:string]:Text}={};
  private pane:SceneObject;private titleText:Text;private bodyText:Text;
  private panes:{[key:string]:{pane:SceneObject;title:Text;body:Text}}={};
  private pending:JourneyView;private key:string='';private inputReadyAt:number=0;private content:SceneObject;
  onAwake():void {
    this.createEvent('OnStartEvent').bind(()=>{this.sceneObject.createComponent('Component.Canvas');this.content=this.plate(this.sceneObject,this.widthCm,10);});
    this.createEvent('UpdateEvent').bind(()=>this.applyPending());
  }
  public show(view:JourneyView):void{this.pending=view;}
  private applyPending():void {
    if(!this.pending||!this.content)return;const v=this.pending;this.pending=null;
    if(this.key!==v.key){
      this.key=v.key;this.inputReadyAt=getTime()+0.6;if(this.pane)this.pane.enabled=false;
      const cached=this.panes[v.key];
      if(cached){this.pane=cached.pane;this.titleText=cached.title;this.bodyText=cached.body;this.pane.enabled=true;}else{
      this.pane=this.obj(this.content,'JourneyPane');
      const col=this.flex(this.pane,this.widthCm-2,9.6,FlexDirection.Column,0.4);
      this.child(col,this.widthCm-2,1.8,so=>this.titleText=this.text(so,'GateLabPrompt',v.title,'Headline1',this.widthCm-2,1.8,new vec4(0.82,0.75,1,1)));
      this.child(col,this.widthCm-3,2.4,so=>this.bodyText=this.text(so,'GateLabExplanation',v.body,'Body',this.widthCm-3,2.4));
      this.child(col,this.widthCm-2,4.3,so=>{
        const row=this.flex(so,this.widthCm-2,4.3,FlexDirection.Row,1.5);
        v.buttons.forEach(data=>this.child(row,data.width,4.3,slot=>{
          const buttonSO=this.obj(slot,data.name);
          const button=buttonSO.createComponent(Button.getTypeName()) as Button;button.size=new vec3(data.width,4.3,1);button.playAudio=false;
          button.setVariant({theme:'SnapOS2',shape:'Rectangle',style:data.name==='Reset'?'Ghost':'Primary'});
          const labelContent=this.obj(buttonSO,'ButtonContent',new vec3(0,0,0.7));
          const labelRow=this.flex(labelContent,data.width-0.5,3,FlexDirection.Row,0);
          this.child(labelRow,data.width-0.5,2.5,label=>this.actionLabels[v.key+':'+data.name]=this.text(label,data.name+'Label',data.label,'Button',data.width-0.5,2.5));
          let armed=false;
          button.onTriggerDown.add(()=>{armed=this.key===v.key&&getTime()>=this.inputReadyAt;});
          button.onTriggerUp.add(()=>{const accepted=armed&&this.key===v.key;armed=false;if(accepted)this.intent.invoke(data.name);});
        }));
      });
    }
      if(!this.panes[v.key])this.panes[v.key]={pane:this.pane,title:this.titleText,body:this.bodyText};
      }
    this.titleText.text=v.title;this.bodyText.text=v.body;
    v.buttons.forEach(button=>{const label=this.actionLabels[v.key+':'+button.name];if(label)label.text=button.label;});
  }

  private obj(parent:SceneObject,name:string,position?:vec3):SceneObject {
    const sceneObject=global.scene.createSceneObject(name);sceneObject.setParent(parent);
    if(position)sceneObject.getTransform().setLocalPosition(position);return sceneObject;
  }
  private liftInZ(sceneObject:SceneObject,zOffset:number):void {
    const transform=sceneObject.getTransform(),pos=transform.getLocalPosition();
    transform.setLocalPosition(new vec3(pos.x,pos.y,pos.z+zOffset));
  }
  private flex(parent:SceneObject,width:number,height:number,direction:FlexDirection,gap:number=0.4):SceneObject {
    const container=this.obj(parent,'Flex');this.liftInZ(container,LAYOUT_Z_LIFT);
    const f=container.createComponent(FlexLayout.getTypeName()) as FlexLayout;f.autoDiscoverItemsOnStart=false;
    const item=container.createComponent(FlexItem.getTypeName()) as FlexItem;item.overrideWidth=width;item.overrideHeight=height;
    f.onInitialized.add(()=>{f.width=width;f.height=height;f.direction=direction;f.justifyContent=FlexJustify.Center;f.alignItems=FlexAlign.Center;f.rowGap=gap;f.columnGap=gap;});
    return container;
  }
  private child(parent:SceneObject,w:number,h:number,build:(so:SceneObject)=>void):SceneObject {
    const so=this.obj(parent,'Item');this.liftInZ(so,LAYOUT_Z_LIFT);
    const item=so.createComponent(FlexItem.getTypeName()) as FlexItem;item.overrideWidth=w;item.overrideHeight=h;item.flexShrink=0;
    build(so);const f=parent.getComponent(FlexLayout.getTypeName()) as FlexLayout;if(f)f.addItems([item]);return so;
  }
  private text(parent:SceneObject,name:string,value:string,role:TextRole,w:number,h:number,color:vec4=new vec4(1,1,1,1)):Text {
    const so=this.obj(parent,name,new vec3(0,0,0.08));
    const t=so.createComponent('Component.Text') as Text;t.text=value;t.depthTest=true;applyTextRole(t,role,this.textScale);
    t.horizontalAlignment=HorizontalAlignment.Center;t.verticalAlignment=VerticalAlignment.Center;
    t.horizontalOverflow=HorizontalOverflow.Overflow;t.verticalOverflow=VerticalOverflow.Overflow;
    t.layoutRect=Rect.create(-w/2,w/2,-h/2,h/2);t.textFill.color=color;return t;
  }
  private plate(parent:SceneObject,w:number,h:number):SceneObject {
    const plate=parent.createComponent(BackPlate.getTypeName()) as BackPlate;plate.size=new vec2(w,h);plate.style='dark';
    return this.obj(parent,'Content',new vec3(0,0,0.6));
  }
}
