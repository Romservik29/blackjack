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
import { autorun, reaction } from 'mobx';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Card } from './app/Card';
import { table } from 'console';
import { cloneElement } from 'react';


const game = new Game("Hero", "1234", 5000)

export const createRoom = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    const camera = new UniversalCamera('camera1', new Vector3(0, 2.5, 2), scene)
    const hlChips = new BABYLON.HighlightLayer("hl-chips", scene);
    const hlChipInHand = new BABYLON.HighlightLayer("hl-chip-in-hand", scene);
    // const camera = new ArcRotateCamera('camera', Math.PI / 6, Math.PI, 1.5, new Vector3(0, 2.5, 1.7), scene)
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
    const places: any = []
    for (let i = 0; i < 3; i++) {
        const tablePlace = game.addPlace(i)
        const place = CreatePlace(game.player.id, tablePlace, scene)
        place.position = new Vector3((firstPlacePos.x - i * 0.65), firstPlacePos.y, firstPlacePos.z)
    }
    // const place1 = CreatePlace(scene, table, game.player.id)
    // place1.position = new Vector3((-0.5), 0.65, (-0.001))
    // const place2 = CreatePlace(scene, table, game.player.id)
    // place2.position = new Vector3(0, 0.65, (-0.001))
    // const place3 = CreatePlace(scene, table, game.player.id)
    // place3.position = new Vector3(0.5, 0.65, (-0.001))
    // const places = [place1, place2, place3]
    //-------------------Deck--------------------------------//
    // const deck = CreateDeck()
    // deck.parent = table
    // deck.position = new Vector3((-0.65), 0, (-0.5))
    //
    camera.setTarget(table.position)
    const chip = createChips(100, hlChips, hlChipInHand, game.player.setChipInHand.bind(game), scene)
    chip.parent = table
    chip.rotation.x = Math.PI / 2
    const chip1 = createChips(200, hlChips, hlChipInHand, game.player.setChipInHand.bind(game), scene)
    chip1.parent = table
    chip1.rotation.x = Math.PI / 2
    chip1.position.x = 0.5
    // const cards: Array<{ mesh: Mesh, position: Vector3 }> = []
    // places.forEach((place) => {
    //     const card = createCard()
    //     card.parent = table
    //     card.rotation.x = Math.PI / 2
    //     const card2 = createCard()
    //     card2.parent = table
    //     card2.rotation.x = Math.PI / 2
    //     const placeAbsPos = place.getAbsolutePosition()
    //     const position2 = new Vector3(placeAbsPos.x, placeAbsPos.y, placeAbsPos.z)
    //     position2.x -= 0.05
    //     position2.y -= 0.05
    //     cards.push({ mesh: card, position: place.position })
    //     cards.push({ mesh: card2, position: position2 })
    // })


    setTimeout(() => {
        game.addPlace(0)
        game.places[0].betChips(100)
    }, 1000)
    reaction(
        () => game.hasBet(),
        hasBet => {
            if (hasBet) {
                const timer = setTimeout(() => {
                    game.status = GameStatus.DEALING
                }, 10000)
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
    const animationX = new BABYLON.Animation("animationX", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: card.position
    });
    keyFrames.push({
        frame: frameRate,
        value: position
    });
    animationX.setKeys(keyFrames);
    const easingFunction = new BABYLON.BezierCurveEase();
    animationX.setEasingFunction(easingFunction)
    card.animations.push(animationX);
    const anim = scene.beginAnimation(card, 0, frameRate, false);
    await anim.waitAsync()
}

function CreatePlace(playerId: string, tablePlace: TablePlace, scene: Scene) {
    const place = MeshBuilder.CreateDisc('place', { radius: 0.1, tessellation: 64 })
    let mat = new StandardMaterial('placeMat', scene)
    mat.diffuseColor = Color3.Yellow()
    place.rotation.x = Math.PI / 2
    place.material = mat
    const planeWidth = 0.3;
    const planeHeight = 0.07;
    const namePlane = BABYLON.MeshBuilder.CreatePlane('place', { width: planeWidth, height: planeHeight })
    namePlane.parent = place
    namePlane.position.y = 0.15

    namePlane.rotation.z = Math.PI
    var DTWidth = 512;
    var DTHeight = 120;
    const textureName = new DynamicTexture('textureName', { width: DTWidth, height: DTHeight }, scene, true);
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
        // const constrols = createControls(scene)
        // const btns = createControls(scene)
        // btns.hitBtn.parent = namePlane
        // btns.hitBtn.position.y = -0.1
    }))
    return place
}

function createCard(): Mesh {
    const cardMesh = MeshBuilder.CreateBox('card', { width: 0.07, height: 0.01, depth: 0.1 })
    return cardMesh
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
    const panel = MeshBuilder.CreatePlane('dealerPlane', { height: 1.2, width: 1.2, sideOrientation: 1 })
    panel.position = new Vector3(0, 1, -1.5);
    const material = new StandardMaterial('dealerMat', scene)
    material.diffuseTexture = new Texture('./textures/dealer.png', scene)
    panel.material = material
    return panel
}
function createChips(value: number, hl: HighlightLayer, hlchipInHand: HighlightLayer, takeChip: (value: number) => void, scene: Scene): Mesh {
    const cylinder = MeshBuilder.CreateCylinder('chips', { height: 0.01, diameterTop: 0.03, diameterBottom: 0.03 })
    cylinder.actionManager = new ActionManager(scene)
    cylinder.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnLeftPickTrigger, () => {
        takeChip(value)
        hlchipInHand.removeAllMeshes()
        hlchipInHand.addMesh(cylinder, Color3.Blue())
        console.log(game.player)
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

function createControls(scene: Scene): ControlsBtn {
    const hitBtn = createHitButton(scene)
    const doubleBtn = createDoubleButton(scene)
    doubleBtn.parent = hitBtn
    doubleBtn.position.x = 0.05
    const splitBtn = createSplitButton(scene)
    splitBtn.parent = doubleBtn
    splitBtn.position.x = 0.05
    const standBtn = createStandButton(scene)
    standBtn.parent = splitBtn
    standBtn.position.x = 0.05

    return { hitBtn, doubleBtn, splitBtn, standBtn }

    function createHitButton(scene: Scene) {
        const plane = BABYLON.MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('hitMat', scene)
        material.diffuseColor = Color3.Teal()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, () => {
            alert("hit")
        }))
        return plane
    }
    function createDoubleButton(scene: Scene) {
        const plane = MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('doubleMat', scene)
        material.diffuseColor = Color3.Yellow()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            alert("double")
        }))
        return plane
    }
    function createSplitButton(scene: Scene) {
        const plane = MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('hitMat', scene)
        material.diffuseColor = Color3.Blue()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            alert("split")
        }))
        return plane
    }
    function createStandButton(scene: Scene) {
        const plane = BABYLON.MeshBuilder.CreatePlane('hitBtn', { width: 0.05, height: 0.05 })
        const material = new StandardMaterial('material', scene)
        material.diffuseColor = Color3.Red()
        plane.material = material
        plane.actionManager = new ActionManager(scene)
        plane.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
            alert("stand")
        }))
        return plane
    }
}

function CreateDeck(): Mesh {
    const box = MeshBuilder.CreateBox('deck', { width: 0.1, height: 0.15, depth: 0.1 })
    return box
}