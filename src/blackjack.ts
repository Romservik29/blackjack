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
    FreeCamera,
    UniversalCamera,
    ExecuteCodeAction,
    ActionManager,
    HighlightLayer,
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
const CARD_WIDTH = 0.09
const CARD_HEIGHT = 0.06

export const createRoom = (canvas: HTMLCanvasElement, game: Game) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    // const camera = new UniversalCamera('camera1', new Vector3(0, 2.5, 0), scene)
    const hlChips = new HighlightLayer("hl-chips", scene);
    const hlChipInHand = new HighlightLayer("hl-chip-in-hand", scene);
    const animCardStak: AnimationCard[] = []
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.8, 1.9, new Vector3(0, 0.7, 0), scene)
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(true)
    var light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 1;
    //------------------------------------------------------------//
    const floor = createFloor(scene)
    const table = createTable(scene)
    table.position = new Vector3(0, 0.7, 0)
    const deckPosition = new Vector3(-0.5, 0.71, 0)
    const dealer = createDealer(scene)
    const dealer3d = {
        placePosition: new Vector3(0, 0.71, -0.1),
        cards: [] as Card3d[]
    }
    //-------------------Places---------------------------------//
    const firstPlacePos = new Vector3((0.4), table.position.y + 0.001, 0.7)
    const ChipStartPos = new Vector3(0, 0, 1)
    const places3d: Place[] = []
    for (let i = 0; i < 3; i++) {
        const tablePlace = game.addPlace(i)
        const chips: Mesh[] = []
        const place = createPlace(game.player.id, i, tablePlace, chips, scene)
        let pos = i % 2 === 0 ? 0 : 0.10
        place.position = new Vector3((firstPlacePos.x - i * 0.4), firstPlacePos.y, firstPlacePos.z + pos)
        places3d.push({ place: place, hands: [], chips })
    }
    // const deck = CreateDeck()
    // deck.parent = table
    // deck.position = new Vector3((-0.65), 0, (-0.5))

    reaction(
        () => game.hasBet(),
        hasBet => {
            if (hasBet && game.status === GameStatus.WAITING_BETS) {
                const timer = setTimeout(() => {
                    game.status = GameStatus.DEALING
                    clearTimeout(timer)
                }, 5000)
            }
        }
    )
    reaction(
        () => game.status,
        async status => {
            switch (status) {
                case GameStatus.WAITING_BETS: {
                    break;
                }
                case GameStatus.DEALING: {
                    await deal()
                    game.status = GameStatus.PLAYING_PLAYERS
                    break;
                }
                case GameStatus.PLAYING_PLAYERS: {
                    const playing = autorun(
                        () => {
                            game.places.forEach((place, placeIdx) => {
                                place.hands.forEach((hand, handIdx) => {
                                    const hand3d = places3d[placeIdx].hands[handIdx]
                                    if (hand.cards.length !== hand3d.cards.length) {
                                        hand.cards.forEach((card, cardIdx) => {
                                            console.log(card)
                                            if (hand3d.cards[cardIdx] === undefined) {
                                                console.log(hand3d.cards[cardIdx])
                                                const card3d: Card3d = { cardMesh: createCard(card.rank, card.suit, deckPosition), card }
                                                const place3d = places3d[placeIdx]
                                                place3d.hands[handIdx].cards.push(card3d)
                                                const { x, y, z } = place3d.place.getAbsolutePosition()
                                                const animcard = {
                                                    mesh: card3d.cardMesh,
                                                    position: new Vector3(
                                                        x - (cardIdx * CARD_WIDTH / 2),
                                                        y + (cardIdx * 0.001),
                                                        z - (cardIdx * CARD_HEIGHT / 2 + 0.15)
                                                    )
                                                }
                                                createAnimationCard(animcard.mesh, animcard.position, scene)
                                            }
                                        })
                                    }
                                })
                            })
                        })
                    reaction(
                        () => game.isAllStand,
                        isAllStand => {
                            console.log(isAllStand)
                            if (isAllStand) {
                                playing()
                                game.status = GameStatus.PLAYING_DEALER
                            }
                        }
                    )
                    break
                }
                case GameStatus.PLAYING_DEALER: {
                    await playDealer()
                    game.status = GameStatus.CALC_FINAL_RESULT
                    break;
                }
                case GameStatus.CALC_FINAL_RESULT: {
                    game.calcFinalResult()
                    setTimeout(() => game.status = GameStatus.CLEAR_CARDS, 3000)
                    break;
                }
                case GameStatus.CLEAR_CARDS: {
                    clearTable()
                    game.clearTable()
                    game.status = GameStatus.WAITING_BETS
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
        await game.deal()
        const hand3d: { mesh: Mesh, position: Vector3 }[][] = []
        console.log(places3d)
        game.places.forEach((place, placeIdx) => {
            place.hands.forEach((hand, handIdx) => {
                if (places3d[placeIdx].hands[handIdx] === undefined) {
                    console.log(placeIdx, handIdx)
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
                        animCards.push({ mesh: card.cardMesh, position: new Vector3(x - (idx * 0.03), y + (idx * 0.001), z - (idx * 0.1 + 0.15)) })
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
        game.dealer.hand.cards.forEach((card, idx) => {
            const card3d: Card3d = { cardMesh: createCard(card.rank, card.suit, deckPosition), card }
            dealer3d.cards.push(card3d)
            const { x, y, z } = dealer3d.placePosition
            animCardStak.push({ mesh: card3d.cardMesh, position: new Vector3(x - (idx * CARD_WIDTH / 2), y + (idx * 0.001), z) })
        })
        await dealCard(animCardStak, scene)
    }
    async function playDealer() {
        while (game.dealer.hand.score < 17) {
            game.dealer.hand.takeCard(game.deck.takeCard())
        }
        game.dealer.hand.cards.forEach((card, cardIdx) => {
            if (dealer3d.cards[cardIdx] === undefined) {
                const card3d = createCard(card.rank, card.suit, deckPosition)
                const { x, y, z } = dealer3d.placePosition
                dealer3d.cards.push({ cardMesh: card3d, card })
                animCardStak.push({ mesh: card3d, position: new Vector3(x - (cardIdx * 0.03), y + (cardIdx * 0.001), z + (cardIdx * 0.09)) })
            }
        })
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
    async function dealCard(cards: Array<{ mesh: Mesh, position: Vector3 }>, scene: Scene,) {
        for (const card of cards) {
            await createAnimationCard(card.mesh, card.position, scene)
        }
        animCardStak.length = 0
    }
    async function createAnimationCard(card: Mesh, position: Vector3, scene: Scene) {
        console.log(card, position)
        const frameRate = 30
        const moveAnimation = new Animation("card-move-animation", "position", frameRate, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const moveFrames = [];
        moveFrames.push({
            frame: 0,
            value: card.position
        });
        const { x, y, z } = position;
        moveFrames.push({
            frame: frameRate / 2,
            value: new Vector3(x - (x / 2), y + 0.15, z - (z / 2))
        });
        moveFrames.push({
            frame: frameRate,
            value: position
        });

        moveAnimation.setKeys(moveFrames);

        const rotateAnimation = new Animation("card-rotate-animation", "rotation.z", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT);
        const rotateFrames = []
        rotateFrames.push({
            frame: 0,
            value: Math.PI
        });
        rotateFrames.push({
            frame: frameRate,
            value: 0
        });
        rotateAnimation.setKeys(rotateFrames)
        card.animations.push(moveAnimation)
        card.animations.push(rotateAnimation)
        const anim = scene.beginAnimation(card, 0, frameRate, false);
        await anim.waitAsync()
    }

    function createPlace(playerId: string, placeId: number, tablePlace: TablePlace, chips: Mesh[], scene: Scene) {
        const place = MeshBuilder.CreateDisc('place', { radius: 0.07, tessellation: 64 })
        const material = new StandardMaterial('place-ellipse-mat', scene)
        const texture = new Texture('./textures/ellipse.png', scene)
        material.opacityTexture = texture
        material.diffuseTexture = texture
        place.rotation.x = Math.PI / 2
        place.material = material
        //--------------//
        const namePlane = MeshBuilder.CreatePlane('place', { width: 0.09, height: 0.09 })
        namePlane.parent = place
        namePlane.position.y += 0.001
        namePlane.rotation.z = Math.PI
        var DTWidth = 256;
        var DTHeight = 256;
        const textureName = new DynamicTexture('name-texture', { width: DTWidth, height: DTHeight }, scene, true);
        const text = "seat"
        var font = "128px monospace";
        const nameMat = new StandardMaterial("nameMat", scene);
        nameMat.diffuseTexture = textureName
        nameMat.diffuseColor = Color3.FromHexString(Color.green)
        namePlane.material = nameMat
        textureName.drawText(text, null, null, font, "black", Color.green, true)
        namePlane.actionManager = new ActionManager(scene)
        namePlane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            if (tablePlace.playerID) {
                const { player } = game
                if (player.chipInHand && game.status === GameStatus.WAITING_BETS) {
                    game.addChipsToBet(placeId)
                    const chip = createChip()
                    chips.push(chip)
                    const position = place.getAbsolutePosition()
                    chip.position = new Vector3(position.x, position.y, position.z)
                    //TODO: animation falling chip
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
                ? 0
                : suit === "Diamond"
                    ? 1
                    : suit === "Heart"
                        ? 2
                        : 3
        let column: number =
            rank === "J"
                ? 11
                : rank === "Q" ? 12
                    : rank === "K" ? 13
                        : rank === "A" ? 0
                            : +rank - 1;


        mat.emissiveTexture = texture;
        mat.disableLighting = true
        const columns = 13
        const rows = 5
        const faceUV = Array(6)
        faceUV[4] = new Vector4(column * 1 / columns, 1 * row / rows, (column + 1) * 1 / columns, (row + 1) * 1 / rows);
        faceUV[5] = new Vector4(2 * 1 / columns, 1 * 5 / rows, (2 + 1) * 1 / columns, (5 + 1) * 1 / rows);
        const card = MeshBuilder.CreateBox('card', { width: 0.12, height: 0.001, faceUV: faceUV, depth: 0.18, wrap: true })
        card.rotation.z = Math.PI
        card.position = position
        card.material = mat
        return card
    }

    function createFloor(scene: Scene): Mesh {
        const ground = GroundBuilder.CreateGround('floor', { width: 15, height: 10 }, scene)
        const mat = new StandardMaterial('groundMat', scene)
        const texture = new Texture('./textures/floor.jpg', scene)
        mat.diffuseTexture = texture
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
        const cylinder = MeshBuilder.CreateCylinder('chip', { height: 0.01, diameterTop: 0.05, diameterBottom: 0.03 })
        return cylinder
    }

    // function createChips(value: number, hl: HighlightLayer, hlchipInHand: HighlightLayer, takeChip: (value: number) => void, scene: Scene): Mesh {
    //     const cylinder = MeshBuilder.CreateCylinder('chips', { height: 0.01, diameterTop: 0.03, diameterBottom: 0.03 })
    //     cylinder.actionManager = new ActionManager(scene)
    //     cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
    //         takeChip(value)
    //         hlchipInHand.removeAllMeshes()
    //         hlchipInHand.addMesh(cylinder, Color3.Blue())
    //     }))
    //     cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
    //         hl.addMesh(cylinder, Color3.Red())
    //     }))
    //     cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
    //         hl.removeMesh(cylinder)
    //     }))
    //     return cylinder
    // }

    function createTable(scene: Scene): Mesh {
        const disc = MeshBuilder.CreateDisc("disc", { radius: 1, tessellation: 64 });
        const borderTable = MeshBuilder.CreateTorus('tableBorder', { diameter: 2, tessellation: 64, thickness: 0.1 })
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

    function CreateDeck(): Mesh {
        const box = MeshBuilder.CreateBox('deck', { width: 0.1, height: 0.15, depth: 0.1 })
        return box
    }
}
