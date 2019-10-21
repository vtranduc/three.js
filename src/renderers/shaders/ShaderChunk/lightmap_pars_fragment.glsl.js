export default /* glsl */`
#ifdef USE_INDIRECT_LIGHTMAP

	uniform sampler2D indirectLightMap;
	uniform float indirectLightMapIntensity;

#endif

#ifdef USE_DIRECT_LIGHTMAP

 	uniform sampler2D directLightMap;
	uniform float directLightMapIntensity;

 #endif
`;
