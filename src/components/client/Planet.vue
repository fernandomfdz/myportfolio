
<template>
  <primitive :object="globe" />
</template>

<script setup>
  import { shallowRef, reactive, computed, watch, onMounted } from 'vue';
  import { useSeek, useRenderLoop, useTresContext } from '@tresjs/core'
  import { Cone, Plane, Sphere, useGLTF } from "@tresjs/cientos"
  import { Color} from "three"
  import { gsap } from 'gsap'
  import ThreeGlobe from "three-globe"
  import countries from "./globe-data-min.json";
  import travelHistory from "./my-flights.json";
  import airportHistory from "./my-airports.json";
  import { useDark, useToggle } from '@vueuse/core'


  const { camera, renderer, cameras } = useTresContext()

  const globe = new ThreeGlobe({
    waitForGlobeReady: true,
    animateIn: true,
  }).hexPolygonsData(countries.features)
  .hexPolygonResolution(4)
  .hexPolygonMargin(0.7)
  .showAtmosphere(true)
  .atmosphereColor("#3a228a")
  .atmosphereAltitude(2)
  .hexPolygonColor((e) => {
    return "rgba(255,255,255, 0.3)";
  });

  // NOTE Arc animations are followed after the globe enters the scene
  setTimeout(() => {
    globe.arcsData(travelHistory.flights)
      .arcColor((e) => {
        return e.status ? "#9cff00" : "#FF4000";
      })
      .arcAltitude((e) => {
        return e.arcAlt;
      })
      .arcStroke((e) => {
        return e.status ? 0.5 : 0.3;
      })
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e) => e.order * 1)
      .labelsData(airportHistory.airports)
      .labelColor(() => "#ffcb21")
      .labelDotOrientation((e) => {
        return e.text === "ALA" ? "top" : "right";
      })
      .labelDotRadius(0.3)
      .labelSize((e) => e.size)
      .labelText("city")
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(airportHistory.airports)
      .pointColor(() => "#ffffff")
      .pointsMerge(true)
      .pointAltitude(0.02)
      .pointRadius(0.05);
  }, 1000);
  
  const globeMaterial = globe.globeMaterial();
  globeMaterial.color = new Color(0x172554 );
  globeMaterial.emissive = new Color(0x220038);
  globeMaterial.emissiveIntensity = 0.3;
  globeMaterial.shininess = 0.7;


  function onDarkModeChange(dark) {
    console.log(camera.value.position)
    globeMaterial.color = new Color(dark ? 0x0c142e : 0x15234f);
    globe.hexPolygonColor((e) => {
      return dark ? "rgba(255,255,255, 0.2)" : "rgba(255,255,255, 0.5)" ;
    });
  }


  const isDark = useDark({
    onChanged: onDarkModeChange,
  });


  console.log(camera.value.position)
</script>