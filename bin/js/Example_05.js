///<reference path="../libs/stagegl-renderer.next.d.ts" />
var training;
(function (training) {
    var View = away.containers.View;
    var HoverController = away.controllers.HoverController;

    var LoaderEvent = away.events.LoaderEvent;

    var AssetLibrary = away.library.AssetLibrary;

    var TextureMaterial = away.materials.TextureMaterial;

    var PrimitivePlanePrefab = away.prefabs.PrimitivePlanePrefab;
    var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
    var DefaultRenderer = away.render.DefaultRenderer;

    var RequestAnimationFrame = away.utils.RequestAnimationFrame;

    var Example_05 = (function () {
        /**
        * Constructor
        */
        function Example_05() {
            var _this = this;
            //scene objects
            this._sphereObjects = new Array();
            this._time = 0;
            //mouse variables
            this._move = false;
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
            var prefab = new PrimitiveSpherePrefab(20, 40, 20);

            for (var i = 0; i < 50; i++) {
                var sphereObject = new SphereObject();

                sphereObject.sphere = prefab.getNewObject();
                sphereObject.sphere.material = this._sphereMaterial;

                sphereObject.startPosition.x = sphereObject.sphere.x = Math.random() * 500 - 250;
                sphereObject.startPosition.y = sphereObject.sphere.y = Math.random() * 100 + 100;
                sphereObject.startPosition.z = sphereObject.sphere.z = Math.random() * 500 - 250;

                sphereObject.startPhase = Math.random() * Math.PI * 2;

                sphereObject.sphere.rotationX = Math.random() * 180;
                sphereObject.sphere.rotationY = Math.random() * 360;
                sphereObject.sphere.rotationZ = Math.random() * 180;

                this._sphereObjects.push(sphereObject);

                this._view.scene.addChild(sphereObject.sphere);
            }

            var plane = new PrimitivePlanePrefab(700, 700).getNewObject();
            plane.material = this._planeMaterial;
            plane.geometry.scaleUV(2, 2);

            this._view.scene.addChild(plane);

            //setup the render loop
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

            this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                return _this.onResourceComplete(event);
            });

            //sphere textures
            AssetLibrary.load(new away.net.URLRequest("assets/beachball_diffuse.jpg"));

            //plane textures
            AssetLibrary.load(new away.net.URLRequest("assets/floor_diffuse.jpg"));
        }
        /**
        * render loop
        */
        Example_05.prototype.onEnterFrame = function (dt) {
            this._time += dt;

            for (var i = 0; i < this._sphereObjects.length; i++) {
                var sphereObject = this._sphereObjects[i];
                sphereObject.sphere.y = Math.abs(sphereObject.startPosition.y * Math.cos(this._time / 500 + sphereObject.startPhase));
            }

            this._view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Example_05.prototype.onResourceComplete = function (event) {
            var assets = event.assets;
            var length = assets.length;

            for (var c = 0; c < length; c++) {
                var asset = assets[c];

                console.log(asset.name, event.url);

                switch (event.url) {
                    case "assets/beachball_diffuse.jpg":
                        this._sphereMaterial.texture = asset;
                        break;

                    case "assets/floor_diffuse.jpg":
                        this._planeMaterial.texture = asset;
                        break;
                }
            }
        };

        /**
        * Mouse down listener for navigation
        */
        Example_05.prototype.onMouseDown = function (event) {
            this._lastPanAngle = this._cameraController.panAngle;
            this._lastTiltAngle = this._cameraController.tiltAngle;
            this._lastMouseX = event.clientX;
            this._lastMouseY = event.clientY;
            this._move = true;
        };

        /**
        * Mouse up listener for navigation
        */
        Example_05.prototype.onMouseUp = function (event) {
            this._move = false;
        };

        Example_05.prototype.onMouseMove = function (event) {
            if (this._move) {
                this._cameraController.panAngle = 0.3 * (event.clientX - this._lastMouseX) + this._lastPanAngle;
                this._cameraController.tiltAngle = 0.3 * (event.clientY - this._lastMouseY) + this._lastTiltAngle;
            }
        };

        /**
        * stage listener for resize events
        */
        Example_05.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Example_05;
    })();
    training.Example_05 = Example_05;
})(training || (training = {}));

var Mesh = away.entities.Mesh;
var Vector3D = away.geom.Vector3D;

/**
* Data class for the sphere objects
*/
var SphereObject = (function () {
    function SphereObject() {
        this.startPosition = new Vector3D();
    }
    return SphereObject;
})();

window.onload = function () {
    new training.Example_05();
};
//# sourceMappingURL=Example_05.js.map
