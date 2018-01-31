import { Color } from '../math/Color';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

function FogGround ( color, opacity, distanceNear, distanceFar, heightNear, heightFar ) {

	this.name = '';

	this.color = new Color( color );
	this.opacity = ( opacity !== undefined ) ? opacity : 1;

	this.distanceNear = ( distanceNear !== undefined ) ? distanceNear : 0;
	this.distanceFar = ( distanceFar !== undefined ) ? distanceFar : 100;
	this.heightNear = ( heightNear !== undefined ) ? heightNear : 0;
	this.heightFar = ( heightFar !== undefined ) ? heightFar : 100;

}

FogGround.prototype.isFogGround = true;

FogGround.prototype.clone = function () {

	return new FogGround( this.color.getHex(), this.opacity, this.distanceNear, this.distanceFar, this.heightNear, this.heightFar );

};

FogGround.prototype.toJSON = function ( meta ) {

	return {
		type: 'FogGround',
		color: this.color.getHex(),
		opacity: this.opacity,
		distanceNear: this.distanceNear,
		distanceFar: this.distanceFar,
		heightNear: this.heightNear,
		heightFar: this.heightFar
	};

};

export { FogGround };
