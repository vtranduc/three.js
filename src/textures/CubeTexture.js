/**
 * @author mrdoob / http://mrdoob.com/
 */

import { Texture } from './Texture.js';
import { CubeReflectionMapping, RGBFormat, BackSide, RepeatWrapping } from '../constants.js';
import { Scene } from '../scenes/Scene';
import { CubeCamera } from '../cameras/CubeCamera'
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial'
import { Mesh } from '../objects/Mesh'
import { SphereBufferGeometry } from '../geometries/SphereGeometry'

function CubeTexture( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding ) {

	images = images !== undefined ? images : [];
	mapping = mapping !== undefined ? mapping : CubeReflectionMapping;
	format = format !== undefined ? format : RGBFormat;

	Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

	this.flipY = false;

}

CubeTexture.prototype = Object.create( Texture.prototype );
CubeTexture.prototype.constructor = CubeTexture;

CubeTexture.prototype.isCubeTexture = true;

Object.defineProperty( CubeTexture.prototype, 'images', {

	get: function () {

		return this.image;

	},

	set: function ( value ) {

		this.image = value;

	}

} );

CubeTexture.prototype.fromEquirectangular = function( renderer, source, size, detail ) {

	var scene = new Scene();

	var gl = renderer.getContext();
	var maxSize = gl.getParameter( gl.MAX_CUBE_MAP_TEXTURE_SIZE )

	var camera = new CubeCamera( 1, 100000, Math.min( size, maxSize ) );

	source.wrapS = source.wrapT = RepeatWrapping;

	var material = new MeshBasicMaterial( {
		map: source,
		side: BackSide
	} );

	var mesh = new Mesh(
		new SphereBufferGeometry( 100, 10 * ( detail || 3 ), 10 * ( detail || 3 ) ),
		material
	);

	scene.add( mesh );

	camera.update( renderer, scene );
	camera.renderTarget.texture.isRenderTargetCubeTexture = true;
	camera.renderTarget.texture.type = source.type
	camera.renderTarget.texture.format = source.format
	camera.renderTarget.texture.encoding = source.encoding

	return camera.renderTarget.texture;

}


export { CubeTexture };
