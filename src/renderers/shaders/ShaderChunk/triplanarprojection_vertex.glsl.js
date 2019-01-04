export default /* glsl */`
if ( enableProjection ) {

  vProjectionPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vProjectionNormal = (modelMatrix * vec4(objectNormal, 0.0)).xyz;

}
`;
