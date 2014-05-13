///<reference path="../libs/stagegl-renderer.next.d.ts" />
var training;
(function (training) {
    var View = away.containers.View;

    var LoaderEvent = away.events.LoaderEvent;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;

    var TextureMaterial = away.materials.TextureMaterial;
    var URLRequest = away.net.URLRequest;
    var PrimitivePlanePrefab = away.prefabs.PrimitivePlanePrefab;
    var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
    var DefaultRenderer = away.render.DefaultRenderer;

    var Example_04 = (function () {
        /**
        * Constructor
        */
        function Example_04() {
            var _this = this;
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
            var prefab = new PrimitiveSpherePrefab(20);

            for (var i = 0; i < 50; i++) {
                var sphere = prefab.getNewObject();
                sphere.material = this._sphereMaterial;

                sphere.x = Math.random() * 500 - 250;
                sphere.y = Math.random() * 100 + 100;
                sphere.z = Math.random() * 500 - 250;

                sphere.rotationX = Math.random() * 180;
                sphere.rotationY = Math.random() * 360;
                sphere.rotationZ = Math.random() * 180;

                this._view.scene.addChild(sphere);
            }

            var plane = new PrimitivePlanePrefab(700, 700).getNewObject();
            plane.material = this._planeMaterial;
            plane.geometry.scaleUV(2, 2);

            this._view.scene.addChild(plane);

            //setup the render loop
            window.onresize = function (event) {
                return _this.onResize(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

            AssetLibrary.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) {
                return _this.onResourceComplete(event);
            });

            //sphere textures
            AssetLibrary.load(new URLRequest("assets/beachball_diffuse.jpg"));

            //plane textures
            AssetLibrary.load(new URLRequest("assets/floor_diffuse.jpg"));
        }
        /**
        * render loop
        */
        Example_04.prototype.onEnterFrame = function (dt) {
            this._camera.transform.position = new Vector3D();
            this._camera.rotationY += 0.1;
            this._camera.transform.moveBackward(800);

            this._view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Example_04.prototype.onResourceComplete = function (event) {
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
        * stage listener for resize events
        */
        Example_04.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Example_04;
    })();
    training.Example_04 = Example_04;
})(training || (training = {}));

window.onload = function () {
    new training.Example_04();
};
//# sourceMappingURL=Example_04.js.map
