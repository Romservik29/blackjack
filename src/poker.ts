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
} from "@babylonjs/core";
import * as BABYLON from '@babylonjs/core'
import { autorun } from 'mobx';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Card } from './app/Card';
import { createReadStream } from 'fs';

const game = new Game("Hero", "1234", 5000)

const places: Array<{ place: TablePlace, position: Vector3 }> = []

export const createRoom = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    const camera = new UniversalCamera('camera1', new Vector3(0, 2.5, 1.7), scene)
    // const camera = new ArcRotateCamera('camera', Math.PI/6, Math.PI, 1.5, new Vector3(0, 0, 0), scene)
    // camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(true)
    const light = new HemisphericLight('HemiLght', new Vector3(0, 100, 0), scene)
    light.intensity = 0.5
    //------------------------------------------------------------//
    createFloor(scene)
    const table = createTable(scene)
    table.position = new Vector3(0, 1, 0)
    game.places.push(new TablePlace(0))
    let meshes: Array<Mesh> = []
    autorun(() => {
        let posX = 0
        let posY = 0
        let posZ = 0
        meshes.forEach((mesh) => {
            mesh.dispose()
        })
        game.places.forEach((place) => {
            places.push({ place, position: new Vector3(posX, posY, posZ) })
            const tableplace = CreatePlace(scene, "Andrey12y78126381783iuhwkdhkjwekdhjk")
            tableplace.parent = table;
            tableplace.position.y = 1
            tableplace.position.z = -0.001
            camera.setTarget(tableplace.getAbsolutePosition())
            meshes.push(tableplace)
        })
    })
    const card1 = createCard()
    card1.parent = table
    const card2 = createCard()
    card2.parent = table
    card2.position.y = 0.002
    card1.position.y = 0.002
    dealCard([card1, card2], scene)
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

function CreatePlace(scene: Scene, playerName: string) {
    const place = MeshBuilder.CreateDisc('place', { radius: 0.1, tessellation: 64 })

    let mat = new StandardMaterial('placeMat', scene)
    mat.diffuseColor = Color3.Yellow()
    place.material = mat
    // const namePlane = BABYLON.MeshBuilder.CreatePlane('place', { width: 0.2, height: 0.5 })
    // namePlane.parent = place
    // const font = "bold 20px monospace";
    // const textureName = new DynamicTexture('textureName', { width: 512, height: 256, subdivisions: 25 }, scene, true);
    // const nameMat = new StandardMaterial("nameMat", scene);
    // namePlane.material = nameMat
    // nameMat.diffuseTexture = textureName
    // textureName.drawText(playerName, 20, 20, font, "black", "green")
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
function createEnv(scene: Scene) {
    const roomBox = BABYLON.MeshBuilder.CreateBox("roomBox", { width: 300, height: 250, depth: 250 }, scene);
    const roomBoxMaterial = new BABYLON.StandardMaterial("wallMat", scene);
    roomBoxMaterial.backFaceCulling = false;
    roomBoxMaterial.reflectionTexture = new BABYLON.CubeTexture('/textures/wall', scene);
    roomBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    roomBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    roomBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    roomBox.material = roomBoxMaterial;
    return roomBox
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