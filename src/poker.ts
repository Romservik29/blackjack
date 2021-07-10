import { Game } from './app/game';
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
} from "@babylonjs/core";
import * as BABYLON from '@babylonjs/core'
import { autorun } from 'mobx';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Card } from './app/Card';
import { createReadStream } from 'fs';
import { table } from 'console';

const game = new Game("Hero", "1234", 5000)

const places: Array<{ place: TablePlace, position: Vector3 }> = []

export const createRoom = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    const camera = new UniversalCamera('camera1', new Vector3(0, 2.5, 2), scene)
    // const camera = new ArcRotateCamera('camera', Math.PI/6, Math.PI, 1.5, new Vector3(0, 2.5, 1.7), scene)
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(true)
    const light = new HemisphericLight('HemiLght', new Vector3(0, 100, 0), scene)
    light.intensity = 1
    //------------------------------------------------------------//
    const floor = createFloor(scene)
    const table = createTable(scene)
    table.position = new Vector3(0, 0.7, 0)
    const dealer = createDealer(scene)
    const place1 = CreatePlace(scene, table)
    place1.position = new Vector3((-0.5), 0.65, (-0.001))
    const place2 = CreatePlace(scene, table)
    place2.position = new Vector3(0, 0.65, (-0.001))
    const place3 = CreatePlace(scene, table)
    place3.position = new Vector3(0.5, 0.65, (-0.001))
    camera.setTarget(dealer.position)
    engine.runRenderLoop(() => {
        scene.render()
    })
}

async function dealCard(cards: Array<Mesh>, scene: Scene) {
    for (const card of cards) {
        await createAnimationCard(card, scene)
    }
}
async function createAnimationCard(card: Mesh, scene: Scene) {
    const frameRate = 60
    const xSlide = new BABYLON.Animation("xSlide", "position.y", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: 0
    });

    keyFrames.push({
        frame: frameRate,
        value: 0.5
    });
    xSlide.setKeys(keyFrames);
    card.animations.push(xSlide);
    const anim = scene.beginAnimation(card, 0, 2 * frameRate, false);
    await anim.waitAsync()
}

function CreatePlace(scene: Scene, parentMesh: Mesh, playerId = "Hello") {
    const place = MeshBuilder.CreateDisc('place', { radius: 0.1, tessellation: 64 })
    place.parent = parentMesh
    let mat = new StandardMaterial('placeMat', scene)
    mat.diffuseColor = Color3.Yellow()
    place.material = mat
    const planeWidth = 0.3;
    const planeHeight = 0.07;
    const namePlane = BABYLON.MeshBuilder.CreatePlane('place', { width: planeWidth, height: planeHeight })
    namePlane.parent = place
    namePlane.position.y = 0.15

    namePlane.rotation.z = Math.PI
    var DTWidth = 512;
    var DTHeight = 172;
    const textureName = new DynamicTexture('textureName', { width: DTWidth, height: DTHeight }, scene, true);
    const text = "seat"
    var font = "64px monospace";
    const nameMat = new StandardMaterial("nameMat", scene);
    nameMat.diffuseTexture = textureName
    namePlane.material = nameMat
    textureName.drawText(text, null, null, font, "black", "white", true)
    place.actionManager = new ActionManager(scene)
    place.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickUpTrigger, () => {
        textureName.clear()
        textureName.drawText(playerId, null, null, font, "black", "white", true)
        // const constrols = createControls(scene)
        createControls(scene).hitBtn.parent = namePlane
    }))
    return place
}

function createCard(): Mesh {
    const cardMesh = MeshBuilder.CreateBox('card', { width: 0.03, height: 0.1, depth: 0.005 })
    return cardMesh
}

function createFloor(scene: Scene) {
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

function createTable(scene: Scene) {
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
function createControls(scene: Scene) {
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
        material.diffuseColor = Color3.Green()
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
    const box = MeshBuilder.CreateBox('deck', { size: 0.35 })
    return box
}

function moveCardX() {
    const animation = new BABYLON.Animation(
        "anim",
        "position.z",
        30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: 0
    })
    keyFrames.push({
        frame: 15,
        value: 2
    })
    keyFrames.push({
        frame: 30,
        value: 0
    })
    animation.setKeys(keyFrames)
    return animation
}
function rotateCardY() {
    const animation = new BABYLON.Animation(
        "anim",
        "rotation.y",
        30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    const keyFrames = [];
    keyFrames.push({
        frame: 0,
        value: 0
    })
    keyFrames.push({
        frame: 60,
        value: Math.PI * 2
    })
    animation.setKeys(keyFrames)
    return animation
}



// const createCard = (scene: Scene) => {
//     const card = MeshBuilder.CreateBox('plane', { width: 1, height: 1 })
//     const mat = new StandardMaterial('cardMat', scene)
//     card.scaling._y = 0.1
//     mat.diffuseColor = Color3.Blue();
//     mat.emissiveColor = Color3.Blue();
//     card.material = mat;
//     card.position = new Vector3(0, 0.1, 0)
//     // card.rotation.x = Math.PI / 2
//     return card
// }