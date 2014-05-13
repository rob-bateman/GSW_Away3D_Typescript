///<reference path="../libs/stagegl-renderer.next.d.ts" />
var training;
(function (training) {
    var View = away.containers.View;

    var LoaderEvent = away.events.LoaderEvent;
    var Vector3D = away.geom.Vector3D;
    var AssetLibrary = away.library.AssetLibrary;

    var TextureMaterial = away.materials.TextureMaterial;
    var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
    var DefaultRenderer = away.render.DefaultRenderer;

    var Example_03 = (function () {
        /**
        * Constructor
        */
        function Example_03() {
            var _this = this;
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
            this._view.camera.z = -600;
            this._view.camera.y = 500;
            this._view.camera.lookAt(new Vector3D());

            //setup the materials
            this._sphereMaterial = new TextureMaterial();
            this._sphereMaterial2 = new TextureMaterial();

            //setup the scene
            var prefab = new PrimitiveSpherePrefab(20, 40, 20);

            for (var i = 0; i < 50; i++) {
                var sphere = prefab.getNewObject();
                sphere.material = (Math.random() > 0.5) ? this._sphereMaterial : this._sphereMaterial2;

                sphere.x = Math.random() * 500 - 250;
                sphere.y = Math.random() * 100 + 100;
                sphere.z = Math.random() * 500 - 250;

                sphere.rotationX = Math.random() * 180;
                sphere.rotationY = Math.random() * 360;
                sphere.rotationZ = Math.random() * 180;

                this._view.scene.addChild(sphere);
            }

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
            AssetLibrary.load(new away.net.URLRequest("assets/beachball_diffuse.jpg"));
            AssetLibrary.load(new away.net.URLRequest("assets/floor_diffuse.jpg"));
        }
        /**
        * render loop
        */
        Example_03.prototype.onEnterFrame = function (dt) {
            this._view.render();
        };

        /**
        * Listener function for resource complete event on asset library
        */
        Example_03.prototype.onResourceComplete = function (event) {
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
                        this._sphereMaterial2.texture = asset;
                        break;
                }
            }
        };

        /**
        * stage listener for resize events
        */
        Example_03.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Example_03;
    })();
    training.Example_03 = Example_03;
})(training || (training = {}));

window.onload = function () {
    new training.Example_03();
};
//# sourceMappingURL=Example_03.js.map
