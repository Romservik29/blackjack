import {AnimationProcessor} from './transport/animationProcessor';
/* eslint-disable new-cap */
import {
  Vector3,
  Engine,
  Scene,
  ArcRotateCamera,
  MeshBuilder,
  GroundBuilder,
  StandardMaterial,
  Color3,
  Mesh,
  // DynamicTexture,
  // ExecuteCodeAction,
  // ActionManager,
  HemisphericLight,
} from '@babylonjs/core';
import {AnimationIntegration} from './transport/animationIntegration';
import {Deck} from './components3d/Deck';

interface Game3DProps {
    canvas: HTMLCanvasElement;
    animationProcessor: AnimationProcessor;
}

export const tableMeshName = 'table';
export const floorMeshName = 'floor';

export class Game3D {
    readonly engine: Engine;
    readonly scene: Scene;
    readonly camera: ArcRotateCamera;
    readonly light: HemisphericLight;
    readonly animationIntegration: AnimationIntegration;
    readonly deck: any;

    constructor(props: Game3DProps) {
      this.engine = new Engine(props.canvas);
      this.scene = new Scene(this.engine);
      this.camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 8, 1.9, new Vector3(0, 0.7, 0), this.scene);
      this.camera.attachControl();
      this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
      this.light.intensity = 1;
      this.deck = new Deck(this.scene);

      this.initGameRoom();

      this.animationIntegration = new AnimationIntegration({
        animationProcessor: props.animationProcessor,
        scene: this.scene,
      });

      this.engine.runRenderLoop(() => {
        this.scene.render();
      });
    }

    public initGameRoom(): void {
      createFloor(this.scene);
      createTable(this.scene);
    }
}

function createTable(scene: Scene): Mesh {
  const disc = MeshBuilder.CreateDisc(tableMeshName, {radius: 1, tessellation: 128});
  const borderTable = MeshBuilder.CreateTorus('tableBorder', {diameter: 2, tessellation: 128, thickness: 0.1});
  disc.rotation.x = Math.PI / 2;
  disc.rotation.z = Math.PI / 2;
  const mat = new StandardMaterial('tableDiscMat', scene);
  mat.emissiveColor = Color3.FromHexString('#FFA69E');
  mat.disableLighting = true;
  disc.material = mat;
  borderTable.parent = disc;
  borderTable.rotation.x = Math.PI / 2;
  disc.position = new Vector3(0, 0.7, 0);
  return disc;
}

function createFloor(scene: Scene): void {
  const ground = GroundBuilder.CreateGround(floorMeshName, {width: 15, height: 10}, scene);
  const mat = new StandardMaterial('groundMat', scene);
  mat.diffuseColor = Color3.FromHexString('#84DCC6');
  ground.material = mat;
}
