///<reference path="../libs/stagegl-renderer.next.d.ts" />

module training
{
	import View						= away.containers.View;
	import Mesh						= away.entities.Mesh;
	import Vector3D					= away.geom.Vector3D;
	import ColorMaterial			= away.materials.ColorMaterial;
	import PrimitiveSpherePrefab	= away.prefabs.PrimitiveSpherePrefab;
	import DefaultRenderer			= away.render.DefaultRenderer;
	import RequestAnimationFrame	= away.utils.RequestAnimationFrame;
	
    export class Example_02
    {
        //engine variables
        private _view:View;

		//material objects
		private _sphereMaterial:ColorMaterial;

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
            this._view.camera.z = -600;
            this._view.camera.y = 500;
            this._view.camera.lookAt(new Vector3D());

			//setup the materials
			this._sphereMaterial = new ColorMaterial(0x5ee400);

            //setup the scene
			var prefab:PrimitiveSpherePrefab = new PrimitiveSpherePrefab(20);

			for (var i:number = 0; i < 50; i++) {
				var sphere:Mesh = <Mesh> prefab.getNewObject();
				sphere.material = this._sphereMaterial;

				sphere.x = Math.random()*500 - 250;
				sphere.y = Math.random()*100 + 100;
				sphere.z = Math.random()*500 - 250;

				this._view.scene.addChild(sphere);
			}

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
    new training.Example_02();
}