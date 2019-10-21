export default /* glsl */`
#if defined( USE_DIRECT_LIGHTMAP ) || defined( USE_INDIRECT_LIGHTMAP ) || defined( USE_AOMAP )

	attribute vec2 uv2;
	varying vec2 vUv2;

	uniform mat3 uv2Transform;

#endif
`;
