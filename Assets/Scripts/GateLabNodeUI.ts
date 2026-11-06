/** Passive reusable circuit node. Owns UIKit labels and hit target, never bits or rules. */
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

@component
export class GateLabNodeUI extends BaseScriptComponent {
  @ui.label('GateLab • circuit node')
  @ui.group_start('Settings')
  @input @hint('Stable semantic name for the native SIK button.') controlName:string='InputA';
  @input @hint('Caption above the value.') caption:string='A · INPUT';
  @input @hint('Width in centimeters.') @widget(new SliderWidget(7,12,0.5)) widthCm:number=8;
  @input @hint('Typography scale at the 110 cm focal plane.') @widget(new SliderWidget(1,1.3,0.05)) textScale:number=1;
  @ui.group_end
  private press=new Event<void>();public get onPress(){return this.press.publicApi();}
  private buttonRoot:SceneObject;private readoutRoot:SceneObject;
  private values:Text[]=[];private captions:Text[]=[];
  onAwake():void{this.createEvent('OnStartEvent').bind(()=>this.build());}
  private build():void {
    this.sceneObject.createComponent('Component.Canvas');
    const surface=this.plate(this.sceneObject,this.widthCm,7);
    this.readoutRoot=this.obj(surface,'Readout');this.nodeLabels(this.readoutRoot);
    this.buttonRoot=this.obj(this.sceneObject,this.controlName,new vec3(0,0,0.2));
    const btn=this.buttonRoot.createComponent(Button.getTypeName()) as Button;btn.size=new vec3(this.widthCm,7,1);btn.playAudio=false;
    btn.setVariant({theme:'SnapOS2',shape:'Rectangle',style:'Secondary'});
    this.nodeLabels(this.obj(this.buttonRoot,'ButtonContent',new vec3(0,0,0.7)));
    let armed=false;let lastPress=-1;
    btn.onTriggerDown.add(e=>{armed=true;});
    btn.onTriggerUp.add(e=>{const accept=armed&&getTime()-lastPress>0.5;armed=false;if(accept){lastPress=getTime();this.press.invoke();}});this.setNode('0',false,new vec4(0.75,0.67,1,1));
  }
  private nodeLabels(content:SceneObject):void {
    const col=this.flex(content,this.widthCm-1,6,FlexDirection.Column,0.1);
    this.child(col,this.widthCm-1,1.5,so=>this.captions.push(this.text(so,this.controlName+'Caption',this.caption,'Caption',this.widthCm-1,1.5)));
    this.child(col,this.widthCm-1,3.2,so=>this.values.push(this.text(so,this.controlName+'Value','0','Title2',this.widthCm-1,3.2)));
  }
  public setNode(value:string,interactive:boolean,color:vec4):void {
    this.values.forEach(t=>{t.text=value;t.textFill.color=color;});
    if(this.buttonRoot)this.buttonRoot.enabled=interactive;if(this.readoutRoot)this.readoutRoot.enabled=!interactive;
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
