/** Parametric dimensional signal paths and traveling beads. Receives presentation only;
 * no truth-table or scoring decisions. Anchors are authored, movable scene references. */
@component
export class GateLabCircuitMesh extends BaseScriptComponent {
  @ui.label('GateLab • dimensional signal paths')
  @ui.group_start('References')
  @input @hint('Imported vertex-color material for the procedural paths.') material!: Material;
  @input @hint('Authored A node anchor.') inputA!: SceneObject;
  @input @hint('Authored B node anchor.') inputB!: SceneObject;
  @input @hint('Authored gate anchor.') gate!: SceneObject;
  @input @hint('Authored output anchor.') output!: SceneObject;
  @ui.group_end
  @ui.group_start('Settings')
  @input @hint('Signal bead speed in path traversals per second.') @widget(new SliderWidget(0.2,2,0.1)) pulseSpeed: number = 0.65;
  @input @hint('Tube radius in centimeters.') @widget(new SliderWidget(0.15,0.5,0.05)) wireRadius: number = 0.26;
  @input('vec4','{0.25,0.95,1,1}') @hint('Active signal color.') @widget(new ColorWidget()) activeColor!: vec4;
  @input('vec4','{0.65,0.56,0.95,1}') @hint('Inactive signal color.') @widget(new ColorWidget()) inactiveColor!: vec4;
  @ui.group_end
  private paths: {root:SceneObject, bead:SceneObject, builder:MeshBuilder, data:number[], points:vec3[], value:number|null}[] = [];
  private time:number = 0;
  onAwake():void {
    this.createEvent('OnStartEvent').bind(()=>this.initialize());
    this.createEvent('UpdateEvent').bind(()=>this.animate());
  }
  private initialize():void {
    if (!this.material || !this.inputA || !this.inputB || !this.gate || !this.output) { console.error('[GateLab] Circuit mesh references missing'); return; }
    const a=this.inputA.getTransform().getLocalPosition();
    const b=this.inputB.getTransform().getLocalPosition();
    const g=this.gate.getTransform().getLocalPosition();
    const y=this.output.getTransform().getLocalPosition();
    this.path('ASignalPath',a.add(new vec3(4,0,-0.7)),g.add(new vec3(-5,2,-0.7)));
    this.path('BSignalPath',b.add(new vec3(4,0,-0.7)),g.add(new vec3(-5,-2,-0.7)));
    this.path('YSignalPath',g.add(new vec3(5,0,-0.7)),y.add(new vec3(-4,0,-0.7)));
    this.setSignals(0,0,0);
  }
  private path(name:string,start:vec3,end:vec3):void {
    const root=global.scene.createSceneObject(name); root.setParent(this.sceneObject);
    const builder=new MeshBuilder([{name:'position',components:3},{name:'normal',components:3},{name:'color',components:4}]);
    builder.topology=MeshTopology.Triangles; builder.indexType=MeshIndexType.UInt16;
    const points:vec3[]=[];
    for(let i=0;i<=32;i++) {
      const t=i/32, s=t*t*(3-2*t);
      points.push(new vec3(start.x+(end.x-start.x)*t,start.y+(end.y-start.y)*s,start.z+Math.sin(t*Math.PI)*1.1));
    }
    const data:number[]=[],indices:number[]=[];
    // Parallel rings: normal cross tangent is checked by outward CCW triangles.
    for(let i=0;i<points.length;i++) {
      const tangent=points[Math.min(i+1,points.length-1)].sub(points[Math.max(0,i-1)]).normalize();
      const u=tangent.cross(vec3.forward()).normalize(),v=tangent.cross(u).normalize();
      for(let j=0;j<=12;j++) {
        const angle=j/12*Math.PI*2, n=u.uniformScale(Math.cos(angle)).add(v.uniformScale(Math.sin(angle)));
        const p=points[i].add(n.uniformScale(this.wireRadius));
        data.push(p.x,p.y,p.z,n.x,n.y,n.z,1,1,1,1);
        if(i<points.length-1 && j<12) { const k=i*13+j; indices.push(k,k+1,k+14,k,k+14,k+13); }
      }
    }
    builder.appendVerticesInterleaved(data); builder.appendIndices(indices); builder.updateMesh();
    const visual=root.createComponent('Component.RenderMeshVisual') as RenderMeshVisual;
    visual.mesh=builder.getMesh(); visual.mainMaterial=this.material;
    const bead=global.scene.createSceneObject(name+'Pulse'); bead.setParent(this.sceneObject);
    const sphere=new MeshBuilder([{name:'position',components:3},{name:'normal',components:3},{name:'color',components:4}]);
    sphere.topology=MeshTopology.Triangles; sphere.indexType=MeshIndexType.UInt16;
    const verts:number[]=[],tri:number[]=[];
    for(let lat=0;lat<=8;lat++) for(let lon=0;lon<=12;lon++) {
      const p=lat/8*Math.PI,q=lon/12*Math.PI*2;
      const x=Math.sin(p)*Math.cos(q), yy=Math.cos(p), z=Math.sin(p)*Math.sin(q);
      verts.push(x*0.55,yy*0.55,z*0.55,x,yy,z,0.8,1,1,1);
      if(lat<8&&lon<12){const k=lat*13+lon;tri.push(k,k+1,k+14,k,k+14,k+13);}
    }
    sphere.appendVerticesInterleaved(verts);sphere.appendIndices(tri);sphere.updateMesh();
    const pv=bead.createComponent('Component.RenderMeshVisual') as RenderMeshVisual;pv.mesh=sphere.getMesh();pv.mainMaterial=this.material;
    this.paths.push({root,bead,builder,data,points,value:0});
  }
  public setSignals(a:number,b:number,y:number|null):void {
    [a,b,y].forEach((value,i)=>{
      const path=this.paths[i];if(!path)return;path.value=value;
      const color=value===1?this.activeColor:this.inactiveColor;
      for(let k=0;k<path.data.length;k+=10){path.data[k+6]=color.x;path.data[k+7]=color.y;path.data[k+8]=color.z;path.data[k+9]=1;path.builder.setVertexInterleaved(k/10,path.data.slice(k,k+10));}
      path.builder.updateMesh();path.bead.enabled=value===1;
    });
  }
  private animate():void {
    this.time+=getDeltaTime()*this.pulseSpeed;
    this.paths.forEach((path,i)=>{
      if(path.value!==1)return;
      const p=((this.time+i*0.18)%1)*(path.points.length-1),k=Math.floor(p),t=p-k;
      path.bead.getTransform().setLocalPosition(vec3.lerp(path.points[k],path.points[Math.min(k+1,path.points.length-1)],t));
    });
  }
}
