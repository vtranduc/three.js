import {
	UVMapping,
	CubeReflectionMapping,
	CubeRefractionMapping,
	EquirectangularReflectionMapping,
	EquirectangularRefractionMapping,
	SphericalReflectionMapping,
	CubeUVReflectionMapping,
	CubeUVRefractionMapping,

	RepeatWrapping,
	ClampToEdgeWrapping,
	MirroredRepeatWrapping,

	NearestFilter,
	NearestMipMapNearestFilter,
	NearestMipMapLinearFilter,
	LinearFilter,
	LinearMipMapNearestFilter,
	LinearMipMapLinearFilter
} from '../constants';
import { Color } from '../math/Color';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Group } from '../objects/Group';
import { Sprite } from '../objects/Sprite';
import { Points } from '../objects/Points';
import { Line } from '../objects/Line';
import { LineLoop } from '../objects/LineLoop';
import { LineSegments } from '../objects/LineSegments';
import { LOD } from '../objects/LOD';
import { Mesh } from '../objects/Mesh';
import { SkinnedMesh } from '../objects/SkinnedMesh';
import { Fog } from '../scenes/Fog';
import { FogExp2 } from '../scenes/FogExp2';
import { FogGround } from '../scenes/FogGround';
import { HemisphereLight } from '../lights/HemisphereLight';
import { SpotLight } from '../lights/SpotLight';
import { PointLight } from '../lights/PointLight';
import { DirectionalLight } from '../lights/DirectionalLight';
import { AmbientLight } from '../lights/AmbientLight';
import { RectAreaLight } from '../lights/RectAreaLight';
import { OrthographicCamera } from '../cameras/OrthographicCamera';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { Scene } from '../scenes/Scene';
import { Texture } from '../textures/Texture';
import { ImageLoader } from './ImageLoader';
import { LoadingManager, DefaultLoadingManager } from './LoadingManager';
import { AnimationClip } from '../animation/AnimationClip';
import { MaterialLoader } from './MaterialLoader';
import { BufferGeometryLoader } from './BufferGeometryLoader';
import { JSONLoader } from './JSONLoader';
import { FileLoader } from './FileLoader';
import * as Geometries from '../geometries/Geometries';
import { Bone } from '../objects/Bone';
import { Skeleton } from '../objects/Skeleton';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function ObjectLoader( manager ) {

	this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;
	this.texturePath = '';

}

Object.assign( ObjectLoader.prototype, {

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new FileLoader( scope.manager );
		loader.load( url, function ( text ) {

			var json = null;

			try {

				json = JSON.parse( text );

			} catch ( error ) {

				if ( onError !== undefined ) onError( error );

				console.error( 'THREE:ObjectLoader: Can\'t parse ' + url + '.', error.message );

				return;

			}

			var metadata = json.metadata;

			if ( metadata === undefined || metadata.type === undefined || metadata.type.toLowerCase() === 'geometry' ) {

				console.error( 'THREE.ObjectLoader: Can\'t load ' + url + '. Use THREE.JSONLoader instead.' );
				return;

			}

			scope.parse( json, onLoad );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json, onLoad ) {

		var options = {}
		if (typeof onLoad !== 'function' && typeof onLoad === 'object') {
			options = onLoad
			onLoad = options.onLoad
		}

		var geoMap = options.geometryMap
		var geometries = geoMap || this.parseGeometries( json.geometries );

		var images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) onLoad( object );

		} );

		var textures = this.parseTextures( json.textures, images );
		var materials = this.parseMaterials( json.materials, textures );

		var skeletons = this.parseSkeletons( json.skeletons );

		var object = this.parseObject( json.object, geometries, materials, skeletons );

		/*
		* Additions for loading animated models
		*/

		if ( json.animations ) {

			object.animations = this.parseAnimations( json.animations );

			var bonesRef = [];
			var skinnedMesh;

			object.traverse(function (child) {
				if (child.type === 'SkinnedMesh') skinnedMesh = child
				if (child.uuid !== object.uuid  && child.type !== 'Bone')  bonesRef.push( child );
			})

			if (!skinnedMesh) return

			// fix for bones that do not have the correct parent
			if (skinnedMesh.children) {
				skinnedMesh.children.forEach(function (bone) {
					// for each bone, find the parent it should be attached to
					if (bone.type !== 'Bone') return
					object.traverse(function (c) {
						if (c.name === bone.name) bone.parent = c.parent
					})
				})
			}

			/*
			* Overwrite skeleton
			* 1. Get copy of bones array from SkinnedMesh skeleton
			* 2. Add to top-level reference array
			* 3. Create new Skeleton from copy and bind to SkinnedMesh
			*/
			if (skinnedMesh.skeleton) {
				var bones = skinnedMesh.skeleton.bones
				var boneInverses = skinnedMesh.skeleton.boneInverses
				bonesRef = bonesRef.concat(bones)
				var skeleton = new Skeleton(bones, boneInverses)
				skinnedMesh.bind(skeleton, skinnedMesh.matrixWorld)
				skinnedMesh.pose()
			}

			// create top-level skeleton reference for animations to bind to
			object.skeleton = { bones: bonesRef };

			object.updateMatrixWorld(true)

		}

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new JSONLoader();
			var bufferGeometryLoader = new BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':
					case 'PlaneBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'BoxBufferGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new Geometries[ data.type ](
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':
					case 'CircleBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.segments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'CylinderGeometry':
					case 'CylinderBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'ConeGeometry':
					case 'ConeBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'SphereGeometry':
					case 'SphereBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'DodecahedronGeometry':
					case 'IcosahedronGeometry':
					case 'OctahedronGeometry':
					case 'TetrahedronGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.detail
						);

						break;

					case 'RingGeometry':
					case 'RingBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.innerRadius,
							data.outerRadius,
							data.thetaSegments,
							data.phiSegments,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'TorusGeometry':
					case 'TorusBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':
					case 'TorusKnotBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.radius,
							data.tube,
							data.tubularSegments,
							data.radialSegments,
							data.p,
							data.q
						);

						break;

					case 'LatheGeometry':
					case 'LatheBufferGeometry':

						geometry = new Geometries[ data.type ](
							data.points,
							data.segments,
							data.phiStart,
							data.phiLength
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data, this.texturePath ).geometry;

						break;

					default:

						console.warn( 'THREE.ObjectLoader: Unsupported geometry type "' + data.type + '"' );

						continue;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json, textures ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new MaterialLoader();
			loader.setTextures( textures );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.type === 'MultiMaterial' ) {

					// Deprecated

					var array = [];

					for ( var j = 0; j < data.materials.length; j ++ ) {

						array.push( loader.parse( data.materials[ j ] ) );

					}

					materials[ data.uuid ] = array;

				} else {

					materials[ data.uuid ] = loader.parse( data );

				}

			}

		}

		return materials;

	},

	parseAnimations: function ( json ) {

		var animations = [];

		for ( var i = 0; i < json.length; i ++ ) {

			var clip = AnimationClip.parse( json[ i ] );

			animations.push( clip );

		}

		return animations;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		function loadImage( url ) {

			scope.manager.itemStart( url );

			return loader.load( url, function () {

				scope.manager.itemEnd( url );

			}, undefined, function () {

				scope.manager.itemEnd( url );
				scope.manager.itemError( url );

				onLoad()

			} );

		}

		if ( json !== undefined && json.length > 0 ) {

			var manager = new LoadingManager( onLoad );

			var loader = new ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var image = json[ i ];
				var path = /^(\/\/)|([a-z]+:(\/\/)?)/i.test( image.url ) ? image.url : scope.texturePath + image.url;

				images[ image.uuid ] = loadImage( path );

			}

		}

		return images;

	},

	parseTextures: function ( json, images ) {

		function parseConstant( value, type ) {

			if ( typeof( value ) === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return type[ value ];

		}

		var textures = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" specified for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture = new Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;

				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping, TEXTURE_MAPPING );

				if ( data.offset !== undefined ) texture.offset.fromArray( data.offset );
				if ( data.repeat !== undefined ) texture.repeat.fromArray( data.repeat );
				if ( data.wrap !== undefined ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ], TEXTURE_WRAPPING );
					texture.wrapT = parseConstant( data.wrap[ 1 ], TEXTURE_WRAPPING );

				}

				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter, TEXTURE_FILTER );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter, TEXTURE_FILTER );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;

				if ( data.flipY !== undefined ) texture.flipY = data.flipY;

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	},

	parseSkeletons: function ( json ) {

		var skeletons = {};

		if ( json === undefined ) return skeletons;

		for ( var i = 0; i < json.length; i ++ ) {

			skeletons[ json[ i ].uuid ] = json[ i ];

		}

		return skeletons;

	},

	parseObject: function () {

		var matrix = new Matrix4();

		return function parseObject( data, geometries, materials, skeletons, parent ) {

			var object;

			function getGeometry( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			}

			function getMaterial( name ) {

				if ( name === undefined ) return undefined;

				if ( Array.isArray( name ) ) {

					var array = [];

					for ( var i = 0, l = name.length; i < l; i ++ ) {

						var uuid = name[ i ];

						if ( materials[ uuid ] === undefined ) {

							console.warn( 'THREE.ObjectLoader: Undefined material', uuid );

						}

						array.push( materials[ uuid ] );

					}

					return array;

				}

				if ( materials[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined material', name );

				}

				return materials[ name ];

			}

			function getSkeleton( name ) {

				if ( name === undefined ) return undefined;

				if ( skeletons[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined skeleton', name );

				}

				return skeletons[ name ];

			}

			switch ( data.type ) {

				case 'Scene':

					object = new Scene();

					if ( data.background !== undefined ) {

						if ( Number.isInteger( data.background ) ) {

							object.background = new Color( data.background );

						}

					}

					if ( data.fog !== undefined ) {

						if ( data.fog.type === 'Fog' ) {

							object.fog = new Fog( data.fog.color, data.fog.near, data.fog.far );

						} else if ( data.fog.type === 'FogExp2' ) {

							object.fog = new FogExp2( data.fog.color, data.fog.density );

						} else if ( data.fog.type === 'FogGround' ) {

							object.fog = new FogGround( data.fog.color, data.fog.opacity, data.fog.distanceEnabled,  data.fog.distanceNear, data.fog.distanceFar, data.fog.heightEnabled, data.fog.heightNear, data.fog.heightFar );

						}

					}

					break;

				case 'PerspectiveCamera':

					object = new PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					if ( data.focus !== undefined ) object.focus = data.focus;
					if ( data.zoom !== undefined ) object.zoom = data.zoom;
					if ( data.filmGauge !== undefined ) object.filmGauge = data.filmGauge;
					if ( data.filmOffset !== undefined ) object.filmOffset = data.filmOffset;
					if ( data.view !== undefined ) object.view = Object.assign( {}, data.view );

					break;

				case 'OrthographicCamera':

					object = new OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new AmbientLight( data.color, data.intensity );

					break;

				case 'DirectionalLight':

					object = new DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'RectAreaLight':

					object = new RectAreaLight( data.color, data.intensity, data.width, data.height );

					break;

				case 'SpotLight':

					object = new SpotLight( data.color, data.intensity, data.distance, data.angle, data.penumbra, data.decay );

					break;

				case 'HemisphereLight':

					object = new HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'RectAreaLight':

					object = new RectAreaLight( data.color, data.intensity, data.width, data.height );

					break;

				case 'Mesh':

					var geometry = getGeometry( data.geometry );
					var material = getMaterial( data.material );

					if ( geometry.bones && geometry.bones.length > 0 ) {

						object = new SkinnedMesh( geometry, material );

					} else {

						object = new Mesh( geometry, material );

					}

					break;

				case 'LOD':

					object = new LOD();

					break;

				case 'Line':

					object = new Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'LineLoop':

					object = new LineLoop( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'LineSegments':

					object = new LineSegments( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'PointCloud':
				case 'Points':

					object = new Points( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new Sprite( getMaterial( data.material ) );

					break;

				case 'Group':

					object = new Group();

					break;

				case 'SkinnedMesh':

					var geometry = getGeometry( data.geometry );
					var material = getMaterial( data.material );
					var skeleton = getSkeleton( data.skeleton );

					var tmpBones, tmpBoneInverses;

					if ( skeleton !== undefined ) {

						if ( geometry.bones !== undefined ) tmpBones = geometry.bones;
						if ( geometry.boneInverses !== undefined ) tmpBoneInverses = geometry.boneInverses;

						geometry.bones = skeleton.bones;
						geometry.boneInverses = skeleton.boneInverses;

					}

					var useVertexTexture = ( skeleton !== undefined ) ? skeleton.useVertexTexture : undefined;

					object = new SkinnedMesh( geometry, material, useVertexTexture );

					if ( skeleton !== undefined ) object.skeleton.uuid = skeleton.uuid;
					if ( data.bindMode !== undefined ) object.bindMode = data.bindMode;
					if ( data.bindMatrix !== undefined ) object.bindMatrix.fromArray( data.bindMatrix );
					object.updateMatrixWorld( true );

					if ( tmpBones !== undefined ) geometry.bones = tmpBones;
					if ( tmpBoneInverses !== undefined ) geometry.boneInverses = tmpBoneInverses;

					break;

				case 'Bone':

					var arg;

					if ( parent instanceof SkinnedMesh ) {

						arg = parent;

					} else if ( parent instanceof Bone ) {

						arg = parent.skin;

					}

					object = new Bone( arg );

					break;

				default:

					object = new Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.quaternion !== undefined ) object.quaternion.fromArray( data.quaternion );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
			if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

			if ( data.shadow ) {

				if ( data.shadow.bias !== undefined ) object.shadow.bias = data.shadow.bias;
				if ( data.shadow.radius !== undefined ) object.shadow.radius = data.shadow.radius;
				if ( data.shadow.mapSize !== undefined ) object.shadow.mapSize.fromArray( data.shadow.mapSize );
				if ( data.shadow.camera !== undefined ) object.shadow.camera = this.parseObject( data.shadow.camera );

			}

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				var children = data.children;

				for ( var  i = 0; i < children.length; i ++ ) {

					object.add( this.parseObject( children[ i ], geometries, materials ) );

				}

			}

			if ( data.type === 'SkinnedMesh' ) {

				var skeleton = getSkeleton( data.skeleton );

				if ( skeleton !== undefined && skeleton.sockets !== undefined ) {

					for ( var i = 0, il = skeleton.sockets.length; i < il; i ++ ) {

						var socket = skeleton.sockets[ i ];

						var found = false;

						for ( var j = 0, jl = object.skeleton.bones.length; j < jl; j ++ ) {

							var bone = object.skeleton.bones[ j ];

							if ( bone.uuid === socket.parent ) {

								bone.add( this.parseObject( socket, geometries, materials, skeletons, bone ) );
								found = true;

								break;

							}

						}

						if ( ! found ) {

							console.warn( 'THREE.ObjectLoader: not found bone uuid ' + socket.parent + ' in skeleton' );

						}

					}

				}

			}

			if ( data.type === 'LOD' ) {

				var levels = data.levels;

				for ( var l = 0; l < levels.length; l ++ ) {

					var level = levels[ l ];
					var child = object.getObjectByProperty( 'uuid', level.object );

					if ( child !== undefined ) {

						object.addLevel( child, level.distance );

					}

				}

			}

			return object;

		};

	}()

} );

var TEXTURE_MAPPING = {
	UVMapping: UVMapping,
	CubeReflectionMapping: CubeReflectionMapping,
	CubeRefractionMapping: CubeRefractionMapping,
	EquirectangularReflectionMapping: EquirectangularReflectionMapping,
	EquirectangularRefractionMapping: EquirectangularRefractionMapping,
	SphericalReflectionMapping: SphericalReflectionMapping,
	CubeUVReflectionMapping: CubeUVReflectionMapping,
	CubeUVRefractionMapping: CubeUVRefractionMapping
};

var TEXTURE_WRAPPING = {
	RepeatWrapping: RepeatWrapping,
	ClampToEdgeWrapping: ClampToEdgeWrapping,
	MirroredRepeatWrapping: MirroredRepeatWrapping
};

var TEXTURE_FILTER = {
	NearestFilter: NearestFilter,
	NearestMipMapNearestFilter: NearestMipMapNearestFilter,
	NearestMipMapLinearFilter: NearestMipMapLinearFilter,
	LinearFilter: LinearFilter,
	LinearMipMapNearestFilter: LinearMipMapNearestFilter,
	LinearMipMapLinearFilter: LinearMipMapLinearFilter
};


export { ObjectLoader };
