import {AnimationProcessor} from './transport/animationProcessor';
/* eslint-disable new-cap */
import {Texture} from '@babylonjs/core/Materials/Textures/texture';
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
  Vector4,
  // Animation,
  HemisphericLight,
} from '@babylonjs/core';
import {AnyRank} from './app/Card';
import {Suit} from './app/enums';
import {AnimationIntegration} from './transport/animationIntegration';

interface Game3DProps {
    canvas: HTMLCanvasElement;
    animationProcessor: AnimationProcessor;
}

export const tableMeshName = 'table';
export const floorMeshName = 'floor';

const CARD_WIDTH = 0.124;
const CARD_HEIGHT = 0.18;
// const PLACE_RADIUS = 0.07;
// const FRAME_RATE = 60;
const deckPosition = new Vector3(-0.7, 0.753, -0.4);

const rowMap: Record<Suit, number> = {
  [Suit.Spade]: 1,
  [Suit.Heart]: 2,
  [Suit.Diamond]: 3,
  [Suit.Club]: 4,
};

const columnMap: Record<string, number> = {
  J: 10,
  Q: 11,
  K: 12,
  A: 0,
};

export class Game3D {
    readonly engine: Engine;
    readonly scene: Scene;
    readonly camera: ArcRotateCamera;
    readonly light: HemisphericLight;
    readonly animationIntegration: AnimationIntegration;

    constructor(props: Game3DProps) {
      this.engine = new Engine(props.canvas);
      this.scene = new Scene(this.engine);
      this.camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 8, 1.9, new Vector3(0, 0.7, 0), this.scene);
      this.light = new HemisphericLight('light', new Vector3(0, 1, 0), this.scene);
      this.light.intensity = 1;
      this.camera.attachControl();
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
      createDeck(this.scene);
    }
}

function createTable(scene: Scene): Mesh {
  const disc = MeshBuilder.CreateDisc(tableMeshName, {radius: 1, tessellation: 128});
  const borderTable = MeshBuilder.CreateTorus('tableBorder', {diameter: 2, tessellation: 128, thickness: 0.1});
  disc.rotation.x = Math.PI / 2;
  disc.rotation.z = Math.PI / 2;
  const mat = new StandardMaterial('tableDiscMat', scene);
  mat.emissiveColor = Color3.FromHexString('#0bcd3a');
  mat.disableLighting = true;
  disc.material = mat;
  borderTable.parent = disc;
  borderTable.rotation.x = Math.PI / 2;
  disc.position = new Vector3(0, 0.7, 0);
  return disc;
}

function createDeck(scene: Scene): Mesh[] {
  const cards = [];
  // TODO: do real deck cards
  const {x, y, z} = deckPosition;
  let posY = y;
  for (let i = 0; i < 52; i++) {
    cards.push(createCard(scene, '2', Suit.Heart, new Vector3(x, posY, z)));
    posY -= 0.001;
  }
  return cards;
}

function createCard(scene: Scene, rank: AnyRank, suit: Suit, position: Vector3): Mesh {
  const mat = new StandardMaterial('mat', scene);
  const texture = new Texture(`./textures/cards/cards.png`, scene);
  const columns = 13;
  const rows = 5;

  mat.emissiveTexture = texture;
  mat.disableLighting = true;

  const row: number = rowMap[suit];
  const column: number = Number(rank) ? Number(rank) - 1 : columnMap[rank];

  const faceUV = Array(6);
  faceUV[4] = new Vector4(column * 1 / columns, 1 * row / rows, (column + 1) * 1 / columns, (row + 1) * 1 / rows);
  faceUV[5] = new Vector4(2 * 1 / columns, 1 * 5 / rows, (2 + 1) * 1 / columns, (5 + 1) * 1 / rows);

  const card = MeshBuilder.CreateBox(
      'card',
      {
        width: CARD_WIDTH,
        height: 0.001,
        faceUV: faceUV,
        depth: CARD_HEIGHT,
        wrap: true,
      },
  );

  card.rotation.z = Math.PI;
  card.position = position;
  card.material = mat;
  return card;
}

function createFloor(scene: Scene): Mesh {
  const ground = GroundBuilder.CreateGround(floorMeshName, {width: 15, height: 10}, scene);
  const mat = new StandardMaterial('groundMat', scene);
  mat.diffuseColor = Color3.FromHexString('#00BCD4');
  ground.material = mat;
  return ground;
}
