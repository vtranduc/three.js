export default /* glsl */`
#if defined( USE_DIRECT_LIGHTMAP ) || defined( USE_INDIRECT_LIGHTMAP ) || defined( USE_AOMAP )

	vUv2 = ( uv2Transform * vec3( uv2, 1 ) ).xy;

#endif
`;
