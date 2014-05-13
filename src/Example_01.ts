///<reference path="../libs/stagegl-renderer.next.d.ts" />

module training
{
	import View						= away.containers.View;
	import Mesh						= away.entities.Mesh;
	import Vector3D					= away.geom.Vector3D;
	import PrimitiveSpherePrefab	= away.prefabs.PrimitiveSpherePrefab;
	import DefaultRenderer			= away.render.DefaultRenderer;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;
	
    export class Example_01
    {
        //engine variables
        private _view:View;

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
			this._view.camera.y = 500;
            this._view.camera.z = -600;
            this._view.camera.lookAt(new Vector3D());

            //setup the scene
            this._view.scene.addChild(new PrimitiveSpherePrefab(100).getNewObject());

            //setup the render loop
            window.onresize  = (event:UIEvent) => this.onResize(event);

            this.onResize();

            this._timer = new RequestAnimationFrame(this.onEnterFrame, this);
            this._timer.start();

        }

        /**
         * render loop
         */
        private onEnterFrame(dt:number):void
        {
            this._view.render();
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
    new training.Example_01();
}