import {
    Vector3,
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    MeshBuilder,
    GroundBuilder,
    StandardMaterial,
    Color3
} from "@babylonjs/core";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as BABYLON from '@babylonjs/core'

export const createRoom = (canvas: HTMLCanvasElement) => {
    const engine = new Engine(canvas)
    const scene = new Scene(engine)
    const camera = new ArcRotateCamera('camera', 0, 0, 0, new Vector3(30, 30, 30), scene)
    camera.upperBetaLimit = Math.PI / 2.2;
    camera.attachControl(true)
    const light = new HemisphericLight('HemiLght', new Vector3(0, 100, 0), scene)
    light.intensity = 0.5

    const roomBox = createEnv(scene)
    roomBox.position = new Vector3(0,0,0)
    const table = createTable(scene)
    table.position = new Vector3(0,5,0)
    camera.setTarget(table.position)
    
    createFloor(scene)
    engine.runRenderLoop(() => {
        scene.render()
    })
}

function createFloor(scene:Scene){
    const ground = GroundBuilder.CreateGround('floor',{width: 300, height: 250}, scene)
    const mat = new StandardMaterial('groundMat', scene)
    mat.diffuseColor = Color3.Yellow();
    ground.material = mat;
    return ground
}
function createEnv(scene: Scene){
    const roomBox = BABYLON.MeshBuilder.CreateBox("roomBox", {width: 300, height: 250, depth: 250}, scene);
    const roomBoxMaterial = new BABYLON.StandardMaterial("wallMat", scene);
    roomBoxMaterial.backFaceCulling = false;
    roomBoxMaterial.reflectionTexture = new BABYLON.CubeTexture('/textures/wall', scene);
    roomBoxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    roomBoxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    roomBoxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    roomBox.material = roomBoxMaterial;
    return roomBox
}

function createTable(scene:Scene){
    const disc = BABYLON.MeshBuilder.CreateDisc("disc", {radius: 50});
    const borderTable = BABYLON.MeshBuilder.CreateTorus('tableBorder', { diameter: 100, tessellation: 64, thickness: 5 })
    borderTable.parent = disc
    disc.rotation.x = Math.PI / 2
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



const createCard = (scene: Scene) => {
    const card = MeshBuilder.CreateBox('plane', { width: 1, height: 1 })
    const mat = new StandardMaterial('cardMat', scene)
    card.scaling._y = 0.1
    mat.diffuseColor = Color3.Blue();
    mat.emissiveColor = Color3.Blue();
    card.material = mat;
    card.position = new Vector3(0, 0.1, 0)
    // card.rotation.x = Math.PI / 2
    return card
}