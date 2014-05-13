///<reference path="../libs/stagegl-renderer.next.d.ts" />
var training;
(function (training) {
    var View = away.containers.View;

    var Vector3D = away.geom.Vector3D;
    var ColorMaterial = away.materials.ColorMaterial;
    var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
    var DefaultRenderer = away.render.DefaultRenderer;

    var Example_02 = (function () {
        /**
        * Constructor
        */
        function Example_02() {
            var _this = this;
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
            this._view.camera.z = -600;
            this._view.camera.y = 500;
            this._view.camera.lookAt(new Vector3D());

            //setup the materials
            this._sphereMaterial = new ColorMaterial(0x5ee400);

            //setup the scene
            var prefab = new PrimitiveSpherePrefab(20);

            for (var i = 0; i < 50; i++) {
                var sphere = prefab.getNewObject();
                sphere.material = this._sphereMaterial;

                sphere.x = Math.random() * 500 - 250;
                sphere.y = Math.random() * 100 + 100;
                sphere.z = Math.random() * 500 - 250;

                this._view.scene.addChild(sphere);
            }

            //setup the render loop
            window.onresize = function (event) {
                return _this.onResize(event);
            };

            this.onResize();

            this._timer = new away.utils.RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();
        }
        /**
        * render loop
        */
        Example_02.prototype.onEnterFrame = function (dt) {
            this._view.render();
        };

        /**
        * stage listener for resize events
        */
        Example_02.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Example_02;
    })();
    training.Example_02 = Example_02;
})(training || (training = {}));

window.onload = function () {
    new training.Example_02();
};
//# sourceMappingURL=Example_02.js.map
