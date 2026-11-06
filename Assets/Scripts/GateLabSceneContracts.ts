/** Stable authored and runtime contracts. Semantic controls are also LEAF lookup names. */
export const GATELAB_MANIFEST={
  tier:'interactive',
  meshBackend:'mesh-builder-scripting',
  meshes:['GateLabCircuitMesh.ts'],
  sfx:['GeneratedSFX/GateClick.wav','GeneratedSFX/GateReveal.wav','GeneratedSFX/GateFinish.wav'],
  icons:[],
  uiModules:['GateLabHeaderUI.ts','GateLabNodeUI.ts','GateLabJourneyUI.ts'],
  semanticControls:['Start','InputA','InputB','GateSelector','StartChallenge','PredictZero','PredictOne','NextQuestion','Replay','Explore','Reset'],
  anchorCm:[0,-10,-110],
  layout:'World anchor (0, -10, -110) cm. Header (0, 17, 0), 44×7 cm. Input A (-18, 6, 0), Input B (-18, -6, 0), each 8×7 cm. Gate (0, 0, 0), 10×7 cm. Output (18, 0, 0), 8×7 cm. Journey (0, -15.5, 1), 44×10 cm. Inputs and output are far-separated; paths connect the near gate; header and journey are separated vertically from the circuit. All offsets local to the fixed world anchor.'
};
