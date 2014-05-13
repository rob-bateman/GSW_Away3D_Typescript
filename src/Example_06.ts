///<reference path="../libs/stagegl-renderer.next.d.ts" />

module training
{
	import Scene					= away.containers.Scene;
	import View						= away.containers.View;
	import HoverController			= away.controllers.HoverController;
	import Camera					= away.entities.Camera;
	import Mesh						= away.entities.Mesh;
	import LoaderEvent				= away.events.LoaderEvent;
	import Vector3D					= away.geom.Vector3D;
	import AssetLibrary				= away.library.AssetLibrary;
	import IAsset					= away.library.IAsset;
	import DirectionalLight			= away.lights.DirectionalLight;
	import PointLight				= away.lights.PointLight;
	import ShadowSoftMethod			= away.materials.ShadowSoftMethod;
	import StaticLightPicker		= away.materials.StaticLightPicker;
	import TextureMaterial			= away.materials.TextureMaterial;
	import URLRequest				= away.net.URLRequest;
	import PrimitivePlanePrefab		= away.prefabs.PrimitivePlanePrefab;
	import PrimitiveSpherePrefab	= away.prefabs.PrimitiveSpherePrefab;
	import DefaultRenderer			= away.render.DefaultRenderer;
	import ImageTexture				= away.textures.ImageTexture;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;
	
    export class Example_06
    {
        //engine variables
        private _view:View;
		private _camera:Camera;
		private _cameraController:HoverController;
		private _scene:Scene;

		//light objects
		private _light1:PointLight;
		private _light2:DirectionalLight;
		private _lightPicker:StaticLightPicker;

        //material objects
		private _sphereMaterial:TextureMaterial;
        private _planeMaterial:TextureMaterial;
		private _shadowMethod:ShadowSoftMethod;

		//scene objects
		private _sphereObjects:Array<SphereObject> = new Array<SphereObject>();

        //tick for frame update
        private _timer:RequestAnimationFrame;
		private _time:number = 0;

		//mouse variables
		private _move:boolean = false;
		private _lastPanAngle:number;
		private _lastTiltAngle:number;
		private _lastMouseX:number;
		private _lastMouseY:number;

        /**
         * Constructor
         */
        constructor()
        {
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
			this._camera = this._view.camera;

			//setup the scene
			this._scene = this._view.scene;

			//setup the camera controller
			this._cameraController = new HoverController(this._camera);
			this._cameraController.panAngle = 45;
			this._cameraController.tiltAngle = 40;
			this._cameraController.distance = 800;
			this._cameraController.minTiltAngle = 5;

			//setup the lights
			this._light1 = new PointLight();
			this._light1.y = 500;
			this._light1.specular = 0;
			this._light1.color = 0x6f8EB8;

			this._scene.addChild(this._light1);

			this._light2 = new DirectionalLight();
			this._light2.ambient = 0.3;
			this._light2.diffuse = 0.7;
			this._scene.addChild(this._light2);

			this._lightPicker = new StaticLightPicker([this._light1, this._light2])

			//setup shadow maps
			this._shadowMethod = new ShadowSoftMethod(this._light2, 10, 5);
			this._shadowMethod.epsilon = 0.2;

				//setup the materials
            this._sphereMaterial = new TextureMaterial();
			this._sphereMaterial.lightPicker = this._lightPicker;
			this._sphereMaterial.shadowMethod = this._shadowMethod;

			this._planeMaterial = new TextureMaterial();
			this._planeMaterial.repeat = true;
			this._planeMaterial.lightPicker = this._lightPicker;
			this._planeMaterial.shadowMethod = this._shadowMethod;

            //setup the scene
			var prefab:PrimitiveSpherePrefab = new PrimitiveSpherePrefab(20, 40, 20);

			for (var i:number = 0; i < 50; i++) {
				var sphereObject:SphereObject = new SphereObject();

				sphereObject.sphere = <Mesh> prefab.getNewObject();
				sphereObject.sphere.material = this._sphereMaterial;

				sphereObject.startPosition.x = sphereObject.sphere.x = Math.random()*500 - 250;
				sphereObject.startPosition.y = sphereObject.sphere.y = Math.random()*100 + 100;
				sphereObject.startPosition.z = sphereObject.sphere.z = Math.random()*500 - 250;

				sphereObject.startPhase = Math.random()*Math.PI*2;

				sphereObject.sphere.rotationX = Math.random()*180;
				sphereObject.sphere.rotationY = Math.random()*360;
				sphereObject.sphere.rotationZ = Math.random()*180;

				this._sphereObjects.push(sphereObject);

				this._view.scene.addChild(sphereObject.sphere);
			}

			var plane:Mesh = <Mesh> new PrimitivePlanePrefab(700, 700).getNewObject();
			plane.material = this._planeMaterial;
			plane.geometry.scaleUV(2, 2);

            this._view.scene.addChild(plane);

            //setup the render loop
            window.onresize  = (event) => this.onResize(event);
			document.onmousedown = (event) => this.onMouseDown(event);
			document.onmouseup = (event) => this.onMouseUp(event);
			document.onmousemove = (event) => this.onMouseMove(event);

            this.onResize();

            this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

			//sphere textures
			AssetLibrary.load(new away.net.URLRequest("assets/beachball_diffuse.jpg"));

            //plane textures
            AssetLibrary.load(new away.net.URLRequest("assets/floor_diffuse.jpg"));
			AssetLibrary.load(new away.net.URLRequest("assets/floor_normal.jpg"));
			AssetLibrary.load(new away.net.URLRequest("assets/floor_specular.jpg"));
        }

        /**
         * render loop
         */
        private onEnterFrame(dt:number):void
        {
			this._time += dt;

			for (var i:number = 0; i < this._sphereObjects.length; i++) {
				var sphereObject:SphereObject = this._sphereObjects[i];
				sphereObject.sphere.y = Math.abs(sphereObject.startPosition.y*Math.cos(this._time/500 + sphereObject.startPhase));
			}

			//this._light1.x = 500*Math.cos(this._time/500);

			this._light2.direction = new Vector3D(Math.sin(this._time/5000), -1, Math.cos(this._time/5000));

			this._view.render();
        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete (event:away.events.LoaderEvent)
        {
            var assets:IAsset[] = event.assets;
            var length:number = assets.length;

            for ( var c : number = 0 ; c < length ; c ++ )
            {
                var asset:IAsset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url)
                {
					//sphere textures
					case "assets/beachball_diffuse.jpg" :
						this._sphereMaterial.texture = <ImageTexture> asset;
						break;

                    //plane textures
                    case "assets/floor_diffuse.jpg" :
                        this._planeMaterial.texture = <ImageTexture> asset;
                        break;
					case "assets/floor_normal.jpg" :
						this._planeMaterial.normalMap = <ImageTexture> asset;
						break;
					case "assets/floor_specular.jpg" :
						this._planeMaterial.specularMap = <ImageTexture> asset;
						break;
                }
            }
        }

		/**
		 * Mouse down listener for navigation
		 */
		private onMouseDown(event):void
		{
			this._lastPanAngle = this._cameraController.panAngle;
			this._lastTiltAngle = this._cameraController.tiltAngle;
			this._lastMouseX = event.clientX;
			this._lastMouseY = event.clientY;
			this._move = true;
		}

		/**
		 * Mouse up listener for navigation
		 */
		private onMouseUp(event):void
		{
			this._move = false;
		}

		private onMouseMove(event)
		{
			if (this._move) {
				this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
				this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
			}
		}

        /**
         * stage listener for resize events
         */
        private onResize(event:Event = null):void
        {
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        }
    }
}


import Mesh						= away.entities.Mesh;
import Vector3D					= away.geom.Vector3D;

/**
 * Data class for the sphere objects
 */
class SphereObject
{
	public sphere:Mesh;
	public startPosition:Vector3D = new Vector3D();
	public startPhase:number;
}

window.onload = function ()
{
    new training.Example_06();
}