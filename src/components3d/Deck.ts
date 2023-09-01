/* eslint-disable new-cap */
import {Mesh, MeshBuilder, Scene, StandardMaterial, Texture, Vector3, Vector4, Animation} from '@babylonjs/core';
import {AnyRank} from '../app/Card';
import {Suit} from '../app/enums';

const CARD_WIDTH = 0.124;
const CARD_HEIGHT = 0.18;
// const PLACE_RADIUS = 0.07;
const FRAME_RATE = 60;
const deckPosition = new Vector3(-0.7, 0.753, -0.4);

interface AnimationCard {
    mesh: Mesh
    position: Vector3
};

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

export class Deck {
    private cards: Mesh[] = [];
    private scene: Scene;
    constructor(scene: Scene) {
      this.scene = scene;
      this.createDeck();
    }

    public createDeck(): void {
      // TODO: do real deck cards
      const {x, y, z} = deckPosition;
      let posY = y;
      for (let i = 0; i < 52; i++) {
        this.cards.push(this.createCard(this.scene, '2', Suit.Heart, new Vector3(x, posY, z)));
        posY -= 0.001;
      }
    }

    public createCard(scene: Scene, rank: AnyRank, suit: Suit, position: Vector3): Mesh {
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
          `card-${suit}-${rank}`,
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

    private async dealCard(cards: Array<AnimationCard>, scene: Scene) {
      for (const card of cards) {
        await this.createFlyCardAnimation(card.mesh, card.position, true, scene);
      }
    }

    private async createFlyCardAnimation(card: Mesh, position: Vector3, rotate: boolean, scene: Scene) {
      const moveAnimation = new Animation(
          'card-move-animation',
          'position',
          FRAME_RATE,
          Animation.ANIMATIONTYPE_VECTOR3,
          Animation.ANIMATIONLOOPMODE_CONSTANT,
      );

      const moveFrames = [];
      moveFrames.push({
        frame: 0,
        value: card.position,
      });
      const {x, y, z} = position;
      if (rotate) {
        moveFrames.push({
          frame: FRAME_RATE / 2,
          value: new Vector3(x - (x / 2), y + 0.15, z - (z / 2)),
        });
      }
      moveFrames.push({
        frame: FRAME_RATE,
        value: position,
      });

      moveAnimation.setKeys(moveFrames);

      const rotateAnimation = new Animation(
          'card-rotate-animation',
          'rotation.z', FRAME_RATE,
          Animation.ANIMATIONTYPE_FLOAT,
          Animation.ANIMATIONLOOPMODE_CONSTANT,
      );

      const rotateFrames = [];
      rotateFrames.push({
        frame: 0,
        value: Math.PI,
      });
      rotateFrames.push({
        frame: FRAME_RATE,
        value: 0,
      });
      rotateAnimation.setKeys(rotateFrames);
      card.animations.push(moveAnimation);
      if (rotate) {
        card.animations.push(rotateAnimation);
      }

      const animation = scene.beginAnimation(card, 0, FRAME_RATE, false);
      await animation.waitAsync();
    }
}

