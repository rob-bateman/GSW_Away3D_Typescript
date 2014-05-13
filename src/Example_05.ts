///<reference path="../libs/stagegl-renderer.next.d.ts" />

module training
{
	import View						= away.containers.View;
	import HoverController			= away.controllers.HoverController;
	import Camera					= away.entities.Camera;
	import Mesh						= away.entities.Mesh;
	import LoaderEvent				= away.events.LoaderEvent;
	import Vector3D					= away.geom.Vector3D;
	import AssetLibrary				= away.library.AssetLibrary;
	import IAsset					= away.library.IAsset;
	import TextureMaterial			= away.materials.TextureMaterial;
	import URLRequest				= away.net.URLRequest;
	import PrimitivePlanePrefab		= away.prefabs.PrimitivePlanePrefab;
	import PrimitiveSpherePrefab	= away.prefabs.PrimitiveSpherePrefab;
	import DefaultRenderer			= away.render.DefaultRenderer;
	import ImageTexture				= away.textures.ImageTexture;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;
	
    export class Example_05
    {
        //engine variables
        private _view:View;
		private _camera:Camera;
		private _cameraController:HoverController;
		
        //material objects
		private _sphereMaterial:TextureMaterial;
        private _planeMaterial:TextureMaterial;

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

			//setup the camera controller
			this._cameraController = new HoverController(this._camera);
			this._cameraController.panAngle = 45;
			this._cameraController.tiltAngle = 40;
			this._cameraController.distance = 800;
			this._cameraController.minTiltAngle = 5;

            //setup the materials
            this._sphereMaterial = new TextureMaterial();
			this._planeMaterial = new TextureMaterial();
			this._planeMaterial.repeat = true;

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
            window.onresize  = (event:UIEvent) => this.onResize(event);
			document.onmousedown = (event:MouseEvent) => this.onMouseDown(event);
			document.onmouseup = (event:MouseEvent) => this.onMouseUp(event);
			document.onmousemove = (event:MouseEvent) => this.onMouseMove(event);

            this.onResize();

            this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

			//sphere textures
			AssetLibrary.load(new away.net.URLRequest("assets/beachball_diffuse.jpg"));

            //plane textures
            AssetLibrary.load(new away.net.URLRequest("assets/floor_diffuse.jpg"));
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

            this._view.render();
        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete(event:LoaderEvent)
        {
            var assets:Array<IAsset> = event.assets;
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
                }
            }
        }

		/**
		 * Mouse down listener for navigation
		 */
		private onMouseDown(event:MouseEvent):void
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
		private onMouseUp(event:MouseEvent):void
		{
			this._move = false;
		}

		private onMouseMove(event:MouseEvent)
		{
			if (this._move) {
				this._cameraController.panAngle = 0.3*(event.clientX - this._lastMouseX) + this._lastPanAngle;
				this._cameraController.tiltAngle = 0.3*(event.clientY - this._lastMouseY) + this._lastTiltAngle;
			}
		}

        /**
         * stage listener for resize events
         */
        private onResize(event:UIEvent = null):void
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
    new training.Example_05();
}