/** Passive title and current-mode view. Receives display strings from the domain owner. */
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
export class GateLabHeaderUI extends BaseScriptComponent {
  @ui.label('GateLab • title and mode')
  @ui.group_start('Settings')
  @input @hint('Title on the panel.') title:string='GateLab AR';
  @input @hint('Panel width in centimeters.') @widget(new SliderWidget(36,46,1)) widthCm:number=44;
  @input @hint('Typography scale.') @widget(new SliderWidget(1,1.3,0.05)) textScale:number=1;
  @ui.group_end
  private mode:Text;
  onAwake():void{this.createEvent('OnStartEvent').bind(()=>{
    this.sceneObject.createComponent('Component.Canvas');const content=this.plate(this.sceneObject,this.widthCm,7);
    const col=this.flex(content,this.widthCm-2,6,FlexDirection.Column,0.3);
    this.child(col,this.widthCm-2,2.6,so=>this.text(so,'GateLabTitle',this.title,'Headline1',this.widthCm-2,2.6,new vec4(0.4,0.95,1,1)));
    this.child(col,this.widthCm-2,1.8,so=>this.mode=this.text(so,'GateLabMode','LOGIC YOU CAN REACH','Caption',this.widthCm-2,1.8));
  });}
  public setMode(value:string):void{if(this.mode)this.mode.text=value;}

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
