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
var examples;
(function (examples) {
    var Loader = away.containers.Loader;

    var HoverController = away.controllers.HoverController;

    var Skybox = away.entities.Skybox;
    var AssetEvent = away.events.AssetEvent;
    var LoaderEvent = away.events.LoaderEvent;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;

    var DirectionalLight = away.lights.DirectionalLight;
    var PointLight = away.lights.PointLight;
    var OBJParser = away.parsers.OBJParser;
    var AWDParser = away.parsers.AWDParser;
    var StaticLightPicker = away.materials.StaticLightPicker;
    var SkyboxMaterial = away.materials.SkyboxMaterial;
    var TextureMaterial = away.materials.TextureMaterial;
    var AssetLoaderContext = away.net.AssetLoaderContext;
    var DefaultRenderer = away.render.DefaultRenderer;

    var Basic_LoadOBJ = (function () {
        /**
        * Constructor
        */
        function Basic_LoadOBJ() {
            this._time = 0;
            this._move = false;
            this.init();
        }
        /**
        * Global initialise function
        */
        Basic_LoadOBJ.prototype.init = function () {
            this.initEngine();
            this.initLights();
            this.initMaterials();
            this.initObjects();
            this.initListeners();
        };

        /**
        * Initialise the engine
        */
        Basic_LoadOBJ.prototype.initEngine = function () {
            this._view = new away.containers.View(new DefaultRenderer());

            //setup the camera for optimal shadow rendering
            this._view.camera.projection.far = 2100;

            //setup controller to be used on the camera
            this._cameraController = new HoverController(this._view.camera, null, 225, 0, 1000);
        };

        /**
        * Initialise the lights
        */
        Basic_LoadOBJ.prototype.initLights = function () {
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
        };

        /**
        * Initialise the materials
        */
        Basic_LoadOBJ.prototype.initMaterials = function () {
            this._lightProbeMaterial = new TextureMaterial();
            this._lightProbeMaterial.alphaPremultiplied = false;
            this._lightProbeMaterial.ambient = 0;
            this._lightProbeMaterial.lightPicker = new StaticLightPicker([this._directionalLight, this._pointLight1, this._pointLight2]);
            this._lightProbeMaterial.gloss = 100;
        };

        /**
        * Initialise the scene objects
        */
        Basic_LoadOBJ.prototype.initObjects = function () {
            this._loader = new Loader();
            this._loader.transform.scale = new Vector3D(7, 7, 7);
            this._loader.y = -700;
            this._view.scene.addChild(this._loader);
        };

        /**
        * Initialise the listeners
        */
        Basic_LoadOBJ.prototype.initListeners = function () {
            var _this = this;
            window.onresize = function (event) {
                return _this.onResize(event);
            };

            document.onmousedown = function (event) {
                return _this.onMouseDown(event);
            };
            document.onmouseup = function (event) {
                return _this.onMouseUp(event);
            };
            document.onmousemove = function (event) {
                return _this.onMouseMove(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            //setup parser to be used on Loader
            AssetLibrary.enableParser(OBJParser);
            AssetLibrary.enableParser(AWDParser);

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                return _this.onResourceComplete(event);
            });

            //setup the url map for textures in the cubemap file
            var assetLoaderContext = new AssetLoaderContext();
            assetLoaderContext.dependencyBaseUrl = "assets/terminator/textures/";

            this._loader.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) {
                return _this.onAssetComplete(event);
            });

            this._loader.load(new away.net.URLRequest("assets/terminator/meshes/t800_new.awd"));

            //environment texture
            AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/arch_texture.cube"), assetLoaderContext);

            //terminator textures
            AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/metal.jpg"));
            AssetLibrary.load(new away.net.URLRequest("assets/terminator/textures/AO.jpg"));
        };

        /**
        * Navigation and render loop
        */
        Basic_LoadOBJ.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            this._view.render();
        };

        /**
        * Listener function for asset complete event on loader
        */
        Basic_LoadOBJ.prototype.onAssetComplete = function (event) {
            var asset = event.asset;

            console.log(asset.assetType + " " + asset.name);

            switch (asset.assetType) {
                case away.library.AssetType.MESH:
                    var mesh = asset;

                    for (var i = 0; i < mesh.subMeshes.length; i++)
                        mesh.subMeshes[i].material = this._lightProbeMaterial;

                    break;
                case away.library.AssetType.MATERIAL:
                    break;
            }
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Basic_LoadOBJ.prototype.onResourceComplete = function (event) {
            var assets = event.assets;
            var length = assets.length;

            for (var c = 0; c < length; c++) {
                var asset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url) {
                    case 'assets/terminator/textures/arch_texture.cube':
                        this._view.scene.addChild(new Skybox(new SkyboxMaterial(asset)));
                        break;

                    case "assets/terminator/textures/metal.jpg":
                        this._lightProbeMaterial.texture = asset;
                        break;
                    case "assets/terminator/textures/AO.jpg":
                        this._lightProbeMaterial.specularMap = asset;
                        break;
                }
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Basic_LoadOBJ.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Basic_LoadOBJ.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        Basic_LoadOBJ.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * stage listener for resize events
        */
        Basic_LoadOBJ.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Basic_LoadOBJ;
    })();
    examples.Basic_LoadOBJ = Basic_LoadOBJ;
})(examples || (examples = {}));

window.onload = function () {
    new examples.Basic_LoadOBJ();
};
//# sourceMappingURL=Basic_LoadOBJ.js.map
