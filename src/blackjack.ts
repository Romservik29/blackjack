import { Camera } from '@babylonjs/core/Cameras/camera';
import { Game, GameStatus } from './app/game';
import { TablePlace } from './app/TablePlace';
import {
    Vector3,
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
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
} from "@babylonjs/core";
import * as BABYLON from '@babylonjs/core'
import { autorun, reaction, toJS } from 'mobx';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Card } from './app/Card';

const game = new Game("Hero", "1234", 5000)

export const createRoom = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    // const camera = new UniversalCamera('camera1', new Vector3(0, 2.5, 2), scene)
    const hlChips = new BABYLON.HighlightLayer("hl-chips", scene);
    const hlChipInHand = new BABYLON.HighlightLayer("hl-chip-in-hand", scene);
    const camera = new ArcRotateCamera('camera', Math.PI / 6, Math.PI, 1.5, new Vector3(0, 2.5, 1.7), scene)
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(true)
    const light = new HemisphericLight('HemiLght', new Vector3(0, 100, 0), scene)
    light.intensity = 1
    //------------------------------------------------------------//
    const floor = createFloor(scene)
    const table = createTable(scene)
    table.position = new Vector3(0, 0.7, 0)
    const dealer = createDealer(scene)
    //-------------------Places---------------------------------//
    const firstPlacePos = new Vector3((0.65), table.position.y + 0.001, 0.5)
    interface Places {
        place: Mesh,
        hands: HandPlace3d[]
    }
    interface HandPlace3d {
        cards: Card3d[]
    }
    interface Card3d {
        cardMesh: Mesh
        card: Card
    }
    const places3d: Places[] = []
    for (let i = 0; i < 3; i++) {
        const tablePlace = game.addPlace(i)
        const place = CreatePlace(game.player.id, i, tablePlace, game.getStatus, scene)//TODO
        place.position = new Vector3((firstPlacePos.x - i * 0.65), firstPlacePos.y, firstPlacePos.z)
        places3d.push({ place: place, hands: [] })
    }
    autorun(
        async () => {
            const hand3d: { mesh: Mesh, position: Vector3 }[][] = []
            game.places.forEach((place, idx) => {
                place.hands.forEach((hand, handIdx) => {
                    if (!places3d[idx].hands[handIdx]) {
                        const cards: Card3d[] = []
                        hand.cards.forEach((card) => {
                            const card3d: Card3d = { cardMesh: createCard(), card }
                            card3d.cardMesh.position = new Vector3(0, 0.71, 0)
                            cards.push(card3d)
                        })
                        const place = places3d[idx]
                        place.hands.push({ cards })
                        const animCards: Array<{ mesh: Mesh, position: Vector3 }> = []
                        cards.forEach((card, idx) => {
                            const { x, y, z } = place.place.getAbsolutePosition()
                            animCards.push({ mesh: card.cardMesh, position: new Vector3(x - (idx * 0.03), y + (idx * 0.001), z - (idx * 0.06)) })
                        })
                        hand3d.push(animCards)
                    }
                })

            })
            const animStak: Array<{ mesh: Mesh, position: Vector3 }> = []
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < hand3d.length; j++) {
                    animStak.push(hand3d[j][i])
                }
            }
            await dealCard(animStak, scene)
            places3d.forEach((place, idx) => {
                if (place.hands[0]) {
                    const card = place.hands[0].cards[0].cardMesh
                    // const some = MeshBuilder.CreatePlane('box', {size: 0.05})
                    // some.parent = card
                    // some.position.y +=0.25
                    // some.rotation.x = Math.PI
                    // some.position = new Vector3(card.position.x,card.position.y+0.5,card.position.z)
                    createHandScore(place.place, scene, camera)
                    const { hitBtn } = createControls(idx, 0, scene)
                    hitBtn.parent = place.place
                    hitBtn.position.x += 0.1
                    hitBtn.position.y += 0.1
                    hitBtn.position.z -= 0.05
                    hitBtn.rotation.x = Math.PI / 4
                }
            })

        })

    // const deck = CreateDeck()
    // deck.parent = table
    // deck.position = new Vector3((-0.65), 0, (-0.5))

    camera.setTarget(table.position)
    const chip = createChips(100, hlChips, hlChipInHand, game.player.setChipInHand, scene)
    chip.parent = table
    chip.rotation.x = Math.PI / 2
    const chip1 = createChips(200, hlChips, hlChipInHand, game.player.setChipInHand, scene)
    chip1.parent = table
    chip1.rotation.x = Math.PI / 2
    chip1.position.x = 0.5

    reaction(
        () => game.hasBet(),
        hasBet => {
            if (hasBet) {
                const timer = setTimeout(() => {
                    game.status = GameStatus.DEALING
                }, 2000)
            }
        }
    )
    reaction(
        () => game.status,
        status => {
            switch (status) {
                case GameStatus.WAITING_BETS: {
                    console.log(GameStatus.WAITING_BETS)
                    break;
                }
                case GameStatus.DEALING: {
                    game.deal()
                    // const card = createCard()
                    // card.position = new Vector3(0, 0.71, 0)
                    // const q = { mesh: card, position: places[1].position }
                    // const {x,y,z} =  places[1].getAbsolutePosition()
                    // setTimeout(() => createAnimationCard(q.mesh, new Vector3(x,y,z), scene), 1000)
                    break;
                }
                case GameStatus.PLAYING_PLAYERS: {
                    console.log(GameStatus.PLAYING_PLAYERS)
                    break;
                }
                case GameStatus.PLAYING_DEALER: {
                    console.log(GameStatus.PLAYING_DEALER)
                    break;
                }
                case GameStatus.CULC_FINAL_RESULT: {
                    console.log(GameStatus.CULC_FINAL_RESULT)
                    break;
                }
                default: return
            }
        }
    )
    engine.runRenderLoop(() => {
        scene.render()
    })
}
async function dealCard(cards: Array<{ mesh: Mesh, position: Vector3 }>, scene: Scene,) {
    for (const card of cards) {
        await createAnimationCard(card.mesh, card.position, scene)
    }
}
async function createAnimationCard(card: Mesh, position: Vector3, scene: Scene) {
    const frameRate = 30
    const animation = new BABYLON.Animation("card-animation", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: card.position
    });
    keyFrames.push({
        frame: frameRate,
        value: position
    });
    animation.setKeys(keyFrames);
    const easingFunction = new BABYLON.BezierCurveEase();
    animation.setEasingFunction(easingFunction)
    card.animations.push(animation);
    const anim = scene.beginAnimation(card, 0, frameRate, false);
    await anim.waitAsync()
}

function createHandScore(place: Mesh, scene: Scene, camera: ArcRotateCamera) {
    const size = 0.05;
    const plane = BABYLON.MeshBuilder.CreatePlane("plane23", { size }, scene);
    plane.parent = place
    plane.position.x -= 0.1
    plane.position.y += 0.1
    plane.position.z -= 0.05
    plane.rotation.x = Math.PI / 4
    //Set font type
    var font_type = "Arial";

    //Set width and height for dynamic texture using same multiplier
    const DTWidth = size * 60;
    const DTHeight = size * 60;

    //Set text
    //Create dynamic texture
    var dynamicTexture = new DynamicTexture("texture", { width: DTWidth, height: DTHeight }, scene, true);



    var font = "12px " + font_type;
    dynamicTexture.drawText("text", 12, 12, font, "#000000", "#ffffff", true);

    //create material
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseTexture = dynamicTexture;

    //apply material
    plane.material = mat;
    return plane
}
function CreatePlace(playerId: string, placeId: number, tablePlace: TablePlace, getStatus: () => GameStatus, scene: Scene) {
    const place = MeshBuilder.CreateDisc('place', { radius: 0.1, tessellation: 64 })
    let mat = new StandardMaterial('placeMat', scene)
    mat.diffuseColor = Color3.Yellow()
    place.rotation.x = Math.PI / 2
    place.material = mat
    place.actionManager = new ActionManager(scene)
    place.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        if (tablePlace.playerID) {
            const { player } = game
            if (player.chipInHand && getStatus() === GameStatus.WAITING_BETS) {
                game.addChipsToBet(playerId, placeId)
                const chip = createChip()
                const position = place.getAbsolutePosition()
                chip.position = new Vector3(position.x, position.y, position.z)
                //TODO: animation falling chip
            }
        }
    }))
    //--------------//
    const planeWidth = 0.3;
    const planeHeight = 0.07;
    const namePlane = BABYLON.MeshBuilder.CreatePlane('place', { width: planeWidth, height: planeHeight })
    namePlane.parent = place
    namePlane.position.y = 0.15

    namePlane.rotation.z = Math.PI
    var DTWidth = 512;
    var DTHeight = 120;
    const textureName = new DynamicTexture('name-texture', { width: DTWidth, height: DTHeight }, scene, true);
    const text = "seat"
    var font = "64px monospace";
    const nameMat = new StandardMaterial("nameMat", scene);
    nameMat.diffuseTexture = textureName
    namePlane.material = nameMat
    textureName.drawText(text, null, null, font, "black", "white", true)
    namePlane.actionManager = new ActionManager(scene)
    namePlane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        textureName.clear()
        tablePlace.setPlayer(playerId)
        textureName.drawText(tablePlace.playerID ?? "unknow", null, null, font, "black", "white", true)
    }))
    return place
}

function createCard(): Mesh {
    const card = MeshBuilder.CreateBox('card', { width: 0.07, height: 0.01, depth: 0.1 })
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
    const panel = MeshBuilder.CreatePlane('dealerPlane', { height: 1, width: 1, sideOrientation: 1 })
    panel.position = new Vector3(0, 1, -1.5);
    const material = new StandardMaterial('dealerMat', scene)
    material.opacityTexture = new Texture('./textures/dealer.png', scene)
    material.diffuseTexture = new Texture('./textures/dealer.png', scene)
    panel.material = material
    return panel
}
function createChip(): Mesh {
    const cylinder = MeshBuilder.CreateCylinder('chip', { height: 0.01, diameterTop: 0.03, diameterBottom: 0.03 })
    return cylinder
}
function createChips(value: number, hl: HighlightLayer, hlchipInHand: HighlightLayer, takeChip: (value: number) => void, scene: Scene): Mesh {
    const cylinder = MeshBuilder.CreateCylinder('chips', { height: 0.01, diameterTop: 0.03, diameterBottom: 0.03 })
    cylinder.actionManager = new ActionManager(scene)
    cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
        takeChip(value)
        hlchipInHand.removeAllMeshes()
        hlchipInHand.addMesh(cylinder, Color3.Blue())
    }))
    cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
        hl.addMesh(cylinder, Color3.Red())
    }))
    cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
        hl.removeMesh(cylinder)
    }))
    return cylinder
}
function createTable(scene: Scene): Mesh {
    const disc = BABYLON.MeshBuilder.CreateDisc("disc", { radius: 1.2, tessellation: 64 });
    const borderTable = BABYLON.MeshBuilder.CreateTorus('tableBorder', { diameter: 2.5, tessellation: 64, thickness: 0.1 })
    disc.rotation.x = Math.PI / 2
    const mat = new StandardMaterial('tableDiscMat', scene)
    mat.diffuseColor = new Color3(0, 1, 0)
    disc.material = mat
    borderTable.parent = disc
    borderTable.rotation.x = Math.PI / 2
    return disc;
}
interface ControlsBtn {
    hitBtn: Mesh;
    doubleBtn: Mesh;
    splitBtn: Mesh;
    standBtn: Mesh;
}

function createControls(placeIdx: number, handIdx: number, scene: Scene): ControlsBtn {
    const hitBtn = createHitButton(placeIdx, handIdx, scene)
    const doubleBtn = createDoubleButton(placeIdx, handIdx, scene)
    doubleBtn.parent = hitBtn
    doubleBtn.position.x = 0.05
    const splitBtn = createSplitButton(placeIdx, handIdx, scene)
    splitBtn.parent = doubleBtn
    splitBtn.position.x = 0.05
    const standBtn = createStandButton(placeIdx, handIdx, scene)
    standBtn.parent = splitBtn
    standBtn.position.x = 0.05

    return { hitBtn, doubleBtn, splitBtn, standBtn }

    function createHitButton(placeIdx: number, handIdx: number, scene: Scene) {
        const plane = BABYLON.MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('hitMat', scene)
        material.diffuseColor = Color3.Teal()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
            game.hit(placeIdx, handIdx)
        }))
        return plane
    }
    function createDoubleButton(placeIdx: number, handIdx: number, scene: Scene) {
        const plane = MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('doubleMat', scene)
        material.diffuseColor = Color3.Yellow()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            game.double(placeIdx, handIdx)
        }))
        return plane
    }
    function createSplitButton(placeIdx: number, handIdx: number, scene: Scene) {
        const plane = MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('hitMat', scene)
        material.diffuseColor = Color3.Blue()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            game.split(placeIdx, handIdx)
        }))
        return plane
    }
    function createStandButton(placeIdx: number, handIdx: number, scene: Scene) {
        const plane = BABYLON.MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('material', scene)
        material.diffuseColor = Color3.Red()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            game.stand(placeIdx, handIdx)
        }))
        return plane
    }
}

function CreateDeck(): Mesh {
    const box = MeshBuilder.CreateBox('deck', { width: 0.1, height: 0.15, depth: 0.1 })
    return box
}