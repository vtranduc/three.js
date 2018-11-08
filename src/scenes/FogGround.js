import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function FogGround ( color, opacity, distanceEnabled, distanceNear, distanceFar, heightEnabled, heightNear, heightFar ) {

	this.name = '';

	this.color = new Color( color );
	this.opacity = ( opacity !== undefined ) ? opacity : 1;
	this.heightEnabled = ( heightEnabled !== undefined ) ? heightEnabled : true
	this.distanceEnabled = ( distanceEnabled !== undefined ) ? distanceEnabled : true

	this.distanceNear = ( distanceNear !== undefined ) ? distanceNear : 0;
	this.distanceFar = ( distanceFar !== undefined ) ? distanceFar : 100;
	this.heightNear = ( heightNear !== undefined ) ? heightNear : 0;
	this.heightFar = ( heightFar !== undefined ) ? heightFar : 100;

}

FogGround.prototype.isFogGround = true;

FogGround.prototype.clone = function () {

	return new FogGround( this.color.getHex(), this.opacity, this.distanceEnabled, this.distanceNear, this.distanceFar, this.heightEnabled, this.heightNear, this.heightFar );

};

FogGround.prototype.toJSON = function ( meta ) {

	return {
		type: 'FogGround',
		color: this.color.getHex(),
		opacity: this.opacity,
		heightEnabled: this.heightEnabled,
		distanceEnabled: this.distanceEnabled,
		distanceNear: this.distanceNear,
		distanceFar: this.distanceFar,
		heightNear: this.heightNear,
		heightFar: this.heightFar
	};

};

export { FogGround };
