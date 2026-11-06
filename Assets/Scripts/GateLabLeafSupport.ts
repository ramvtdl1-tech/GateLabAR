import {DefaultLeafInteractor} from 'Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor';
import {findInteractablesByName} from 'Leaf.lspkg/Interactors/InteractableUtils';
import {findSceneObjectByName,findSceneObjectsByName,sleep} from 'Leaf.lspkg/Utils/common/Utils';
import {expect} from 'Leaf.lspkg/Utils/common/Expect';
import {GateLabMain} from './GateLabMain';
export {sleep,expect,findSceneObjectByName,findInteractablesByName};
export function main():GateLabMain{return findSceneObjectByName('GateLabAR').getComponent(GateLabMain.getTypeName()) as GateLabMain;}
export function active(o:SceneObject):boolean{for(let n=o;n;n=n.getParent())if(!n.enabled)return false;return true;}
export function label(name:string):string{const o=findSceneObjectsByName(name).find(active);if(!o)throw Error('Missing active label '+name);return (o.getComponent('Component.Text') as Text).text;}
export function hasControl(name:string):boolean{return findInteractablesByName(name,undefined,true).length>0;}
export class GateLabTestDriver{
 private interactor=new DefaultLeafInteractor();
 async press(name:string):Promise<void>{const c=findInteractablesByName(name,undefined,true)[0];if(!c)throw Error('Missing active control '+name);await this.interactor.trigger(c);await sleep(850);}
 async welcome():Promise<void>{await sleep(1700);if(main().getSnapshot().phase!=='welcome')await this.press('Reset');expect(main().getSnapshot().phase).toBe('welcome');}
 async explore():Promise<void>{await this.welcome();await this.press('Start');expect(main().getSnapshot().phase).toBe('explore');}
 async finish(predictions:number[]=[0,1,0]):Promise<void>{await this.explore();await this.press('StartChallenge');for(const p of predictions){await this.press(p===0?'PredictZero':'PredictOne');expect(main().getSnapshot().phase).toBe('feedback');await this.press('NextQuestion');}expect(main().getSnapshot().phase).toBe('finish');}
}
