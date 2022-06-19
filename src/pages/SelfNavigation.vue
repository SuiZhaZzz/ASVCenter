<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <!-- <h1>自主导航</h1> -->
    <!-- <div class="row full-width wrap"> -->
    <div id="cesiumContainer" class="row full-width wrap"></div>
    <!-- </div> -->

  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  mounted() {
    let externalScript = document.createElement('script');
    externalScript.setAttribute('src', './node_modules/cesium/Build/Cesium/Cesium.js')
    document.head.appendChild(externalScript)
    Cesium.Ion.defaultAccesstoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmUzMTZjZi03ZDVmLTQxYTItYTI0NC05ODZmMTk5OWFmNTkiLCJpZCI6MzU0MDgsImlhdCI6MTYwMTk2OTc4MH0.m2Euaq9VOqnsid8zEa6OsmdCfZ309BzbfZ4ocAJvHZ0';
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    });
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());

    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(105.440690, 28.865833, 400),
      orientation: {
        heading: Cesium.Math.toRadians(0.0),
        pitch: Cesium.Math.toRadians(-15.0),
      }
    });


  }
});
</script>
