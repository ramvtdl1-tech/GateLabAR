/** Native LEAF registry for observed GateLab controls and journey. */
import {scenariosIndex} from 'Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator';
import {ScenarioMetadata} from 'Leaf.lspkg/Scenarios/scenario/ScenarioMetadata';
import {GateLabTruthTableScenario} from './GateLabTruthTableScenario';
import {GateLabChallengeScenario} from './GateLabChallengeScenario';
import {GateLabRecoveryScenario} from './GateLabRecoveryScenario';
import {GateLabIKScenario} from './GateLabIKScenario';
@component
export class GateLabLeafIndex extends BaseScriptComponent{
 @scenariosIndex static scenariosIndex:ScenarioMetadata[]=[
  {id:'gatelab-truth-table',typename:GateLabTruthTableScenario.getTypeName(),parameters:{__leaf__timeout_secs:'90'}},
  {id:'gatelab-challenge',typename:GateLabChallengeScenario.getTypeName(),parameters:{__leaf__timeout_secs:'90'}},
  {id:'gatelab-recovery',typename:GateLabRecoveryScenario.getTypeName(),parameters:{__leaf__timeout_secs:'120'}},
  {id:'gatelab-ik-reach',typename:GateLabIKScenario.getTypeName(),parameters:{__leaf__timeout_secs:'60'}}
 ];
}
