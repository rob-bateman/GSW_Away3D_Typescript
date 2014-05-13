///<reference path="../libs/stagegl-renderer.next.d.ts" />

/*

 obj file loading example in Away3d

 Demonstrates:

 How to use the Loader3D object to load an embedded internal obj model.
 How to map an external asset reference inside a file to an internal embedded asset.
 How to extract material data and use it to set custom material properties on a model.

 Code by Rob Bateman
 rob@infiniteturtles.co.uk
 http://www.infiniteturtles.co.uk

 This code is distributed under the MIT License

 Copyright (c) The Away Foundation http://www.theawayfoundation.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the “Software”), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */

module examples
{
	import Loader					= away.containers.Loader;
	import Scene					= away.containers.Scene;
	import View						= away.containers.View;
	import HoverController			= away.controllers.HoverController;
	import Camera					= away.entities.Camera;
	import Mesh						= away.entities.Mesh;
	import Skybox					= away.entities.Skybox;
	import AssetEvent				= away.events.AssetEvent;
	import LoaderEvent				= away.events.LoaderEvent;
	import Vector3D					= away.geom.Vector3D;
	import AssetLibrary				= away.library.AssetLibrary;
	import IAsset					= away.library.IAsset;
	import DirectionalLight			= away.lights.DirectionalLight;
	import PointLight				= away.lights.PointLight;
	import OBJParser				= away.parsers.OBJParser;
	import AWDParser				= away.parsers.AWDParser;
	import StaticLightPicker		= away.materials.StaticLightPicker;
	import SkyboxMaterial			= away.materials.SkyboxMaterial;
	import TextureMaterial			= away.materials.TextureMaterial;
	import AssetLoaderContext		= away.net.AssetLoaderContext;
	import DefaultRenderer			= away.render.DefaultRenderer;
	import CubeTextureBase			= away.textures.CubeTextureBase;
	import Texture2DBase			= away.textures.Texture2DBase;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;

	export class Basic_LoadOBJ
	{
		//engine variables
		private _view:View;
		private _cameraController:HoverController;

		//material objects
		private _lightProbeMaterial:TextureMaterial;

		//light objects
		private _directionalLight:DirectionalLight;
		private _pointLight1:PointLight;
		private _pointLight2:PointLight;

		//scene objects
		private _loader:Loader;

		//navigation variables
		private _timer:RequestAnimationFrame;
		private _time:number = 0;
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
			this.init();
		}

		/**
		 * Global initialise function
		 */
		private init():void
		{
			this.initEngine();
			this.initLights();
			this.initMaterials();
			this.initObjects();
			this.initListeners();
		}

		/**
		 * Initialise the engine
		 */
		private initEngine():void
		{
			this._view = new View(new DefaultRenderer());

			//setup the camera for optimal shadow rendering
			this._view.camera.projection.far = 2100;

			//setup controller to be used on the camera
			this._cameraController = new HoverController(this._view.camera, null, 225, 0, 1000);
		}

		/**
		 * Initialise the lights
		 */
		private initLights():void
		{
			this._pointLight1 = new PointLight();
			this._pointLight1.color = 0xff1111;
			this._pointLight1.x = 500;
			this._pointLight1.y = -50;
			this._pointLight1.z = 300;
			this._view.scene.addChild(this._pointLight1);

			this._pointLight2 = new PointLight();
			this._pointLight2.color = 0x6688ff;
			this._pointLight2.x = -500;
			this._pointLight2.y = 50;
			this._pointLight2.z = 500;
			this._view.scene.addChild(this._pointLight2);

			this._directionalLight = new DirectionalLight();
			this._directionalLight.color = 0xffffee;
			this._directionalLight.ambient = 1;
			this._directionalLight.ambientColor = 0x202030;
			this._directionalLight.castsShadows = true;
			this._directionalLight.shadowMapper.depthMapSize = 2048;
		}

		/**
		 * Initialise the materials
		 */
		private initMaterials():void
		{
			this._lightProbeMaterial = new TextureMaterial();
			this._lightProbeMaterial.alphaPremultiplied = false;
			this._lightProbeMaterial.ambient = 0;
			this._lightProbeMaterial.lightPicker = new StaticLightPicker([this._directionalLight, this._pointLight1, this._pointLight2]);
			this._lightProbeMaterial.gloss = 100;
		}

		/**
		 * Initialise the scene objects
		 */
		private initObjects():void
		{
			this._loader = new Loader();
			this._loader.transform.scale = new Vector3D(7, 7, 7);
			this._loader.y = -700;
			this._view.scene.addChild(this._loader);
		}

		/**
		 * Initialise the listeners
		 */
		private initListeners():void
		{
			window.onresize  = (event) => this.onResize(event);

			document.onmousedown = (event) => this.onMouseDown(event);
			document.onmouseup = (event) => this.onMouseUp(event);
			document.onmousemove = (event) => this.onMouseMove(event);

			this.onResize();

			this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
			this._timer.start();

			//setup parser to be used on Loader
			AssetLibrary.enableParser(OBJParser);
			AssetLibrary.enableParser(AWDParser);

			AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, (event:LoaderEvent) => this.onResourceComplete(event));

			//setup the url map for textures in the cubemap file
			var assetLoaderContext:AssetLoaderContext = new AssetLoaderContext();
			assetLoaderContext.dependencyBaseUrl = "assets/terminator/textures/";

			this._loader.addEventListener(AssetEvent.ASSET_COMPLETE, (event:AssetEvent) => this.onAssetComplete(event));

			this._loader.load(new away.net.URLRequest("assets/terminator/meshes/t800_new.awd"));

			//environment texture
			AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/arch_texture.cube"), assetLoaderContext);

			//terminator textures
			AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/metal.jpg"));
			AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/AO.jpg"));
		}

		/**
		 * Navigation and render loop
		 */
		private onEnterFrame(dt:number):void
		{
			this._time += dt;

			this._view.render();
		}

		/**
		 * Listener function for asset complete event on loader
		 */
		private onAssetComplete (event:away.events.AssetEvent)
		{
			var asset:away.library.IAsset = event.asset;

			console.log(asset.assetType + " " + asset.name);

			switch (asset.assetType)
			{
				case away.library.AssetType.MESH :
					var mesh:Mesh = <Mesh> asset;

					for (var i:number = 0; i < mesh.subMeshes.length; i++)
						mesh.subMeshes[i].material = this._lightProbeMaterial;

					break;
				case away.library.AssetType.MATERIAL :

					break;
			}
		}

		/**
		 * Listener function for resource complete event on asset library
		 */
		private onResourceComplete (event:away.events.LoaderEvent)
		{
			var assets:away.library.IAsset[] = event.assets;
			var length:number = assets.length;

			for ( var c : number = 0 ; c < length ; c ++ )
			{
				var asset:away.library.IAsset = assets[c];

				console.log(asset.name, event.url);

				switch (event.url)
				{
					case 'assets/terminator/textures/arch_texture.cube':
						this._view.scene.addChild(new Skybox(new SkyboxMaterial(<CubeTextureBase> asset)));
						break;

					//terminator textures
					case "assets/terminator/textures/metal.jpg" :
						this._lightProbeMaterial.texture = <Texture2DBase> asset;
						break;
					case "assets/terminator/textures/AO.jpg" :
						this._lightProbeMaterial.specularMap = <Texture2DBase> asset;
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
		private onResize(event = null):void
		{
			this._view.y         = 0;
			this._view.x         = 0;
			this._view.width     = window.innerWidth;
			this._view.height    = window.innerHeight;
		}
	}
}


window.onload = function ()
{
	new examples.Basic_LoadOBJ();
}