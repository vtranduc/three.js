import { Light } from './Light.js';
import { DirectionalLightShadow } from './DirectionalLightShadow.js';
import { Object3D } from '../core/Object3D.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function DirectionalLight( color, intensity ) {

	Light.call( this, color, intensity );

	this.type = 'DirectionalLight';

	this.position.copy( Object3D.DefaultUp );
	this.updateMatrix();

	this.target = new Object3D();

	this.shadow = new DirectionalLightShadow();
	this.shadowCascade = [new DirectionalLightShadow(), new DirectionalLightShadow(), new DirectionalLightShadow()];
	this.spareMatrix = new THREE.Matrix4()
	this.workMinVec = new THREE.Vector2()
	this.workMaxVec = new THREE.Vector2()

}

DirectionalLight.prototype = Object.assign( Object.create( Light.prototype ), {

	constructor: DirectionalLight,

	isDirectionalLight: true,

	updateCascades: function ( cameraFrusta, sceneBoundingBox ) {
		// Update our shadow camera frustum to fit the viewing frustum
		cameraFrusta.map( _.bind( function ( cameraFrustumVerts, index ) {
			var transformedBox = sceneBoundingBox.clone();
			var firstVert = true
			this.shadowCascade[index].camera.updateMatrixWorld()
			var inv = this.spareMatrix.getInverse(this.shadowCascade[index].camera.matrixWorld);
			for (var i = 0; i < cameraFrustumVerts.length; i++) {
				var frustumVert = cameraFrustumVerts[i];
				frustumVert.applyMatrix4(inv);
				if (!firstVert) {
					this.workMinVec.x = Math.min(frustumVert.x, this.workMinVec.x);
					this.workMinVec.y = Math.min(frustumVert.y, this.workMinVec.y);
					this.workMaxVec.x = Math.max(frustumVert.x, this.workMaxVec.x);
					this.workMaxVec.y = Math.max(frustumVert.y, this.workMaxVec.y);
				} else {
					this.workMinVec.x = frustumVert.x;
					this.workMinVec.y = frustumVert.y;
					this.workMaxVec.x = frustumVert.x;
					this.workMaxVec.y = frustumVert.y;
					firstVert = false
				}
			}

			// We limit our shadow cam to fit the scene or to the calculated frustum, whichever is a tighter bound.
			transformedBox.applyMatrix4(inv);
			this.shadowCascade[index].camera.left = Math.max(this.workMinVec.x, transformedBox.min.x);
			this.shadowCascade[index].camera.bottom = Math.max(this.workMinVec.y, transformedBox.min.y);
			this.shadowCascade[index].camera.right = Math.min(this.workMaxVec.x, transformedBox.max.x);
			this.shadowCascade[index].camera.top = Math.min(this.workMaxVec.y, transformedBox.max.y);

			this.shadowCascade[index].camera.far = Math.max(0, -transformedBox.min.z);
			this.shadowCascade[index].camera.updateProjectionMatrix();
		}, this));
		this.shadow = this.shadowCascade[2];
	},

	copy: function ( source ) {

		Light.prototype.copy.call( this, source );

		this.target = source.target.clone();

		this.shadow = source.shadow.clone();

		var cloneFunction = function (element) {
			return element.clone()
		}

		this.shadowCascade = source.shadowCascade.map(cloneFunction);

		return this;

	}

} );


export { DirectionalLight };
