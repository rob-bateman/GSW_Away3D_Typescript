///<reference path="../libs/stagegl-renderer.next.d.ts" />

module training
{
	import View						= away.containers.View;
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
	
    export class Example_04
    {
        //engine variables
        private _view:View;
		private _camera:Camera;

        //material objects
		private _sphereMaterial:TextureMaterial;
        private _planeMaterial:TextureMaterial;

        //tick for frame update
        private _timer:RequestAnimationFrame;

        /**
         * Constructor
         */
        constructor()
        {
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
			this._camera = this._view.camera;
            this._camera.rotationX = 40;

            //setup the materials
            this._sphereMaterial = new TextureMaterial();
			this._planeMaterial = new TextureMaterial();
			this._planeMaterial.repeat = true;

            //setup the scene
			var prefab:PrimitiveSpherePrefab = new PrimitiveSpherePrefab(20);

			for (var i:number = 0; i < 50; i++) {
				var sphere:Mesh = <Mesh> prefab.getNewObject();
				sphere.material = this._sphereMaterial;

				sphere.x = Math.random()*500 - 250;
				sphere.y = Math.random()*100 + 100;
				sphere.z = Math.random()*500 - 250;

				sphere.rotationX = Math.random()*180;
				sphere.rotationY = Math.random()*360;
				sphere.rotationZ = Math.random()*180;

				this._view.scene.addChild(sphere);
			}

			var plane:Mesh = <Mesh> new PrimitivePlanePrefab(700, 700).getNewObject();
			plane.material = this._planeMaterial;
			plane.geometry.scaleUV(2, 2);

			this._view.scene.addChild(plane);

            //setup the render loop
            window.onresize  = (event:UIEvent) => this.onResize(event);

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

			//sphere textures
			AssetLibrary.load(new URLRequest("assets/beachball_diffuse.jpg"));

            //plane textures
            AssetLibrary.load(new URLRequest("assets/floor_diffuse.jpg"));
        }

        /**
         * render loop
         */
        private onEnterFrame(dt:number):void
        {
			this._camera.transform.position = new Vector3D();
			this._camera.rotationY += 0.1;
			this._camera.transform.moveBackward(800);

            this._view.render();
        }

        /**
         * Listener function for resource complete event on asset library
         */
        private onResourceComplete (event:LoaderEvent)
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


window.onload = function ()
{
    new training.Example_04();
}