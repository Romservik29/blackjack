import { Color } from './color';
import { Game, GameStatus } from './app/game';
import { TablePlace } from './app/TablePlace';
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
    DynamicTexture,
    ExecuteCodeAction,
    ActionManager,
    Vector4,
    Animation,
    HemisphericLight,
} from "@babylonjs/core";
import { autorun, reaction } from 'mobx';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Card, AnySuit, AnyRank } from './app/Card';

interface Place {
    place: Mesh,
    chips: Mesh[]
    hands: HandPlace3d[]
}
interface HandPlace3d {
    cards: Card3d[]
}
interface Card3d {
    cardMesh: Mesh
    card: Card
}
interface AnimationCard {
    mesh: Mesh
    position: Vector3
}
const CARD_WIDTH = 0.124
const CARD_HEIGHT = 0.18
const PLACE_RADIUS = 0.07
const FRAME_RATE = 60

export const createRoom = (canvas: HTMLCanvasElement, game: Game) => {
    const engine = new Engine(canvas)

    const scene = new Scene(engine)
    new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 8, 1.9, new Vector3(0, 0.7, 0), scene)

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1;

    createFloor(scene)

    const table = createTable(scene)
    table.position = new Vector3(0, 0.7, 0)

    createDealer(scene)
    const dealer3d = {
        placePosition: new Vector3(0, 0.71, -0.4),
        cards: [] as Card3d[]
    }

    const animCardStak: AnimationCard[] = []
    const deckPosition = new Vector3(-0.7, 0.753, -0.4)
    const firstPlacePos = new Vector3(0.5, table.position.y + 0.001, 0.5)
    const ChipStartPos = new Vector3(0, 0.9, 0)

    const places3d: Place[] = []

    for (let i = 0; i < 3; i++) {
        const tablePlace = game.addPlace(i)
        const chips: Mesh[] = []
        const place = createPlace(game.player.id, i, tablePlace, chips, scene)
        let pos = i % 2 === 0 ? 0 : 0.10
        place.position = new Vector3((firstPlacePos.x - i * 0.5), firstPlacePos.y, firstPlacePos.z + pos)
        places3d.push({ place: place, hands: [], chips })
    }

    createDeck()

    reaction(
        () => game.status,
        async status => {
            switch (status) {
                case GameStatus.DEALING: {
                    deal()
                    break;
                }
                case GameStatus.PLAYING_PLAYERS: {
                    const playing = autorun(
                        () => {
                            game.handsHasBet.forEach((hand) => {
                                const placeIdx = hand.placeId
                                const hand3d = places3d[placeIdx].hands[hand.idx]
                                if (hand.cards.length !== hand3d.cards.length) {
                                    hand.cards.forEach((card, cardIdx) => {
                                        if (hand3d.cards[cardIdx] === undefined) {
                                            const card3d: Card3d = { cardMesh: createCard(card.rank, card.suit, deckPosition), card }
                                            const place3d = places3d[placeIdx]
                                            place3d.hands[hand.idx].cards.push(card3d)
                                            const { x, y, z } = place3d.place.getAbsolutePosition()
                                            const animcard = {
                                                mesh: card3d.cardMesh,
                                                position: new Vector3(
                                                    x - (cardIdx * CARD_WIDTH / 2),
                                                    y + (cardIdx * 0.001),
                                                    z - (cardIdx * CARD_HEIGHT / 2 + PLACE_RADIUS * 2)
                                                )
                                            }
                                            createAnimationCard(animcard.mesh, animcard.position, true, scene)
                                        }
                                    })
                                }
                            })
                        })
                    reaction(
                        () => game.isAllStand,
                        isAllStand => {
                            if (isAllStand) {
                                playing()
                                setTimeout(() => game.setStatus(GameStatus.PLAYING_DEALER), 1000)
                            }
                        }
                    )
                    break
                }
                case GameStatus.PLAYING_DEALER: {
                    game.playDealer(17)
                    await playDealer()
                    game.setStatus(GameStatus.CALC_FINAL_RESULT)
                    break;
                }
                case GameStatus.CALC_FINAL_RESULT: {
                    game.calcFinalResult()
                    setTimeout(() => game.setStatus(GameStatus.CLEAR_CARDS), 3000)
                    break;
                }
                case GameStatus.CLEAR_CARDS: {
                    clearTable()
                    game.clearTable()
                    game.setStatus(GameStatus.WAITING_BETS)
                    game.setTimer(10)
                    break;
                }
                default: return
            }
        }
    )

    engine.runRenderLoop(() => {
        scene.render()
    })

    async function deal() {
        const hand3d: { mesh: Mesh, position: Vector3 }[][] = []
        game.places.forEach((place, placeIdx) => {
            place.hands.forEach((hand, handIdx) => {
                if (places3d[placeIdx].hands[handIdx] === undefined) {
                    const cards: Card3d[] = []
                    hand.cards.forEach((card) => {
                        const card3d: Card3d = { cardMesh: createCard(card.rank, card.suit, deckPosition), card }
                        cards.push(card3d)
                    })
                    const place3d = places3d[placeIdx]
                    place3d.hands.push({ cards })
                    const animCards: Array<{ mesh: Mesh, position: Vector3 }> = []
                    cards.forEach((card, idx) => {
                        const { x, y, z } = place3d.place.getAbsolutePosition()
                        animCards.push({
                            mesh: card.cardMesh,
                            position: new Vector3(
                                x - (idx * CARD_WIDTH / 2),
                                y + (idx * 0.001),
                                z - (idx * CARD_HEIGHT / 2 + PLACE_RADIUS * 2))
                        })
                    })
                    hand3d.push(animCards)
                }
            })
        })
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < hand3d.length; j++) {
                animCardStak.push(hand3d[j][i])
            }
        }
        const delerHand: { mesh: Mesh, pos: Vector3 }[] = []
        game.dealer.hand.cards.forEach((card, idx) => {
            const card3d: Card3d = { cardMesh: createCard(card.rank, card.suit, deckPosition), card }
            dealer3d.cards.push(card3d)
            const { x, y, z } = dealer3d.placePosition
            delerHand.push({
                mesh: card3d.cardMesh,
                pos: new Vector3(
                    x - (idx * CARD_WIDTH / 2),
                    y + (idx * 0.001),
                    z)
            })
        })
        await dealCard(animCardStak, scene)
        await createAnimationCard(delerHand[0].mesh, delerHand[0].pos, true, scene)
        await createAnimationCard(delerHand[1].mesh, delerHand[1].pos, false, scene)
        game.setStatus(GameStatus.PLAYING_PLAYERS)
    }
    async function playDealer() {
        game.dealer.hand.cards.forEach((card, cardIdx) => {
            if (dealer3d.cards[cardIdx] === undefined) {
                const card3d = createCard(card.rank, card.suit, deckPosition)
                const { x, y, z } = dealer3d.placePosition
                dealer3d.cards.push({ cardMesh: card3d, card })
                animCardStak.push({
                    mesh: card3d,
                    position: new Vector3(
                        x - (cardIdx * CARD_WIDTH / 2),
                        y + (cardIdx * 0.001),
                        z)
                })
            }
        })
        await dealerFaceUpCard(dealer3d.cards[1].cardMesh, scene)
        game.dealer.hand.cards[1].isFaceUp = true;
        await dealCard(animCardStak, scene)
    }

    function clearTable() {
        places3d.forEach((place) => {
            place.chips.forEach((chip) => {
                chip.dispose()
            })
            place.chips.length = 0
            place.hands.forEach((hand) => {
                hand.cards.forEach((card) => {
                    card.cardMesh.dispose()
                })
            })
            place.hands.length = 0
        })
        dealer3d.cards.forEach((card) => {
            card.cardMesh.dispose()
        })
        dealer3d.cards.length = 0
    }
    async function dealCard(cards: Array<AnimationCard>, scene: Scene,) {
        for (const card of cards) {
            await createAnimationCard(card.mesh, card.position, true, scene)
        }
        animCardStak.length = 0
    }
    async function createAnimationCard(card: Mesh, position: Vector3, rotate: boolean, scene: Scene) {
        const moveAnimation = new Animation("card-move-animation", "position", FRAME_RATE, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const moveFrames = [];
        moveFrames.push({
            frame: 0,
            value: card.position
        });
        const { x, y, z } = position;
        if (rotate) {
            moveFrames.push({
                frame: FRAME_RATE / 2,
                value: new Vector3(x - (x / 2), y + 0.15, z - (z / 2))
            });
        }
        moveFrames.push({
            frame: FRAME_RATE,
            value: position
        });

        moveAnimation.setKeys(moveFrames);

        const rotateAnimation = new Animation("card-rotate-animation", "rotation.z", FRAME_RATE, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const rotateFrames = []
        rotateFrames.push({
            frame: 0,
            value: Math.PI
        });
        rotateFrames.push({
            frame: FRAME_RATE,
            value: 0
        });
        rotateAnimation.setKeys(rotateFrames)
        card.animations.push(moveAnimation)
        if (rotate) {
            card.animations.push(rotateAnimation)
        }
        const anim = scene.beginAnimation(card, 0, FRAME_RATE, false);
        await anim.waitAsync()
    }
    async function dealerFaceUpCard(card: Mesh, scene: Scene) {
        const moveAnimation = new Animation("card-move-animation", "position.y", FRAME_RATE, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const moveFrames = [];
        const y = card.position.y
        moveFrames.push({
            frame: 0,
            value: y
        });
        moveFrames.push({
            frame: FRAME_RATE / 2,
            value: y + 0.2
        });
        moveFrames.push({
            frame: FRAME_RATE,
            value: y
        });

        moveAnimation.setKeys(moveFrames);

        const rotateAnimation = new Animation("card-rotate-animation", "rotation.z", FRAME_RATE, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const rotateFrames = []
        rotateFrames.push({
            frame: 0,
            value: Math.PI
        });
        rotateFrames.push({
            frame: FRAME_RATE,
            value: 0
        });
        rotateAnimation.setKeys(rotateFrames)
        card.animations.length = 0;
        card.animations.push(moveAnimation)
        card.animations.push(rotateAnimation)
        const anim = scene.beginAnimation(card, 0, FRAME_RATE, false);
        await anim.waitAsync()
    }
    function betChipAnimation(chip: Mesh, position: Vector3, scene: Scene) {
        const moveAnimation = new Animation("move", "position", FRAME_RATE, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
        const moveKeys = []
        moveKeys.push({
            frame: 0,
            value: chip.position
        })
        moveKeys.push({
            frame: FRAME_RATE,
            value: position
        })
        moveAnimation.setKeys(moveKeys)
        chip.animations.push(moveAnimation)
        const rotateAnimation = new Animation("move", "rotation.x", FRAME_RATE, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
        const rotateKeys = []
        rotateKeys.push({
            frame: 0,
            value: Math.PI / 2
        })
        rotateKeys.push({
            frame: FRAME_RATE,
            value: 0
        })
        rotateAnimation.setKeys(rotateKeys)
        chip.animations.push(moveAnimation)
        chip.animations.push(rotateAnimation)
        scene.beginAnimation(chip, 0, FRAME_RATE, false, 4)
    }

    function createPlace(playerId: string, placeId: number, tablePlace: TablePlace, chips: Mesh[], scene: Scene) {
        const place = MeshBuilder.CreateDisc('place', { radius: PLACE_RADIUS, tessellation: 64 })
        const material = new StandardMaterial('place-ellipse-mat', scene)
        const texture = new Texture('./textures/ellipse.png', scene)
        material.opacityTexture = texture
        material.emissiveTexture = texture
        material.disableLighting = true
        place.rotation.x = Math.PI / 2
        place.material = material
        //--------------//
        const namePlane = MeshBuilder.CreatePlane('place', { width: 0.09, height: 0.09 })
        namePlane.parent = place
        namePlane.position.y += 0.001
        namePlane.rotation.z = Math.PI
        const textureName = new DynamicTexture('name-texture', { width: 512, height: 256 }, scene, true);
        const text = "seat"
        const font = "128px monospace";
        const nameMat = new StandardMaterial("nameMat", scene);
        nameMat.emissiveTexture = textureName
        nameMat.disableLighting = true
        nameMat.diffuseColor = Color3.FromHexString(Color.green)
        namePlane.material = nameMat
        textureName.drawText(text, null, null, font, "black", Color.green, true)
        place.actionManager = new ActionManager(scene)
        namePlane.actionManager = place.actionManager
        place.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            if (tablePlace.playerID) {
                const { player } = game
                if (player.chipInHand && game.status === GameStatus.WAITING_BETS) {
                    if (player.chips >= player.chipInHand) {
                        game.addChipsToBet(placeId)
                        const chip = createChip()
                        chip.actionManager = place.actionManager
                        chip.position = ChipStartPos;
                        betChipAnimation(chip, place.getAbsolutePosition(), scene)
                        chips.push(chip)
                    }
                }
            } else {
                textureName.clear()
                textureName.drawText("", null, null, "", "", Color.green)
                tablePlace.setPlayer(playerId)
            }
        }))
        return place
    }

    function createCard(rank: AnyRank, suit: AnySuit, position: Vector3): Mesh {
        const mat = new StandardMaterial("mat", scene);
        const texture = new Texture(`./textures/cards/cards.png`, scene);
        let row: number =
            suit === "Spade"
                ? 1
                : suit === "Heart"
                    ? 2
                    : suit === "Diamond"
                        ? 3
                        : 4
        let column: number =
            rank === "J"
                ? 10
                : rank === "Q" ? 11
                    : rank === "K" ? 12
                        : rank === "A"
                            ? 0
                            : +rank - 1;


        mat.emissiveTexture = texture;
        mat.disableLighting = true
        const columns = 13
        const rows = 5
        const faceUV = Array(6)
        faceUV[4] = new Vector4(column * 1 / columns, 1 * row / rows, (column + 1) * 1 / columns, (row + 1) * 1 / rows);
        faceUV[5] = new Vector4(2 * 1 / columns, 1 * 5 / rows, (2 + 1) * 1 / columns, (5 + 1) * 1 / rows);
        const card = MeshBuilder.CreateBox('card', { width: CARD_WIDTH, height: 0.001, faceUV: faceUV, depth: CARD_HEIGHT, wrap: true })
        card.rotation.z = Math.PI
        card.position = position
        card.material = mat
        return card
    }

    function createFloor(scene: Scene): Mesh {
        const ground = GroundBuilder.CreateGround('floor', { width: 15, height: 10 }, scene)
        const mat = new StandardMaterial('groundMat', scene)
        mat.diffuseColor = Color3.FromHexString("#00BCD4")
        ground.material = mat;
        return ground
    }
    function createDealer(scene: Scene): Mesh {
        const panel = MeshBuilder.CreatePlane('dealerPlane', { height: 0.7, width: 0.7, sideOrientation: 1 })
        panel.position = new Vector3(0, 1, -1);
        const material = new StandardMaterial('dealerMat', scene)
        const texture = new Texture('./textures/dealer.png', scene)
        material.opacityTexture = texture
        material.diffuseTexture = texture
        panel.material = material
        return panel
    }
    function createChip(): Mesh {
        const cylinder = MeshBuilder.CreateCylinder('chip', { height: 0.01, diameterTop: 0.05, diameterBottom: 0.05 })
        return cylinder
    }

    function createTable(scene: Scene): Mesh {
        const disc = MeshBuilder.CreateDisc("disc", { radius: 1, tessellation: 128 });
        const borderTable = MeshBuilder.CreateTorus('tableBorder', { diameter: 2, tessellation: 128, thickness: 0.1 })
        disc.rotation.x = Math.PI / 2
        disc.rotation.z = Math.PI / 2
        const mat = new StandardMaterial('tableDiscMat', scene)
        mat.emissiveColor = Color3.FromHexString("#0bcd3a")
        mat.disableLighting = true
        disc.material = mat
        borderTable.parent = disc
        borderTable.rotation.x = Math.PI / 2
        return disc;
    }

    function createDeck(): Mesh[] {
        const cards = []
        //TODO: do real deck cards
        const { x, y, z } = deckPosition
        let posY = y
        for (let i = 0; i < 52; i++) {
            cards.push(createCard("2", "Heart", new Vector3(x, posY, z)))
            posY -= 0.001
        }
        return cards
    }
}
