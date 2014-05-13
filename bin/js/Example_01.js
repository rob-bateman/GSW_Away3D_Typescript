///<reference path="../libs/stagegl-renderer.next.d.ts" />
var training;
(function (training) {
    var View = away.containers.View;

    var Vector3D = away.geom.Vector3D;
    var PrimitiveSpherePrefab = away.prefabs.PrimitiveSpherePrefab;
    var DefaultRenderer = away.render.DefaultRenderer;

    var Example_01 = (function () {
        /**
        * Constructor
        */
        function Example_01() {
            var _this = this;
            //setup the view
            this._view = new View(new DefaultRenderer());

            //setup the camera
            this._view.camera.y = 500;
            this._view.camera.z = -600;
            this._view.camera.lookAt(new Vector3D());

            //setup the scene
            this._view.scene.addChild(new PrimitiveSpherePrefab(100).getNewObject());

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
        Example_01.prototype.onEnterFrame = function (dt) {
            this._view.render();
        };

        /**
        * stage listener for resize events
        */
        Example_01.prototype.onResize = function (event) {
            if (typeof event === "undefined") { event = null; }
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };
        return Example_01;
    })();
    training.Example_01 = Example_01;
})(training || (training = {}));

window.onload = function () {
    new training.Example_01();
};
//# sourceMappingURL=Example_01.js.map
