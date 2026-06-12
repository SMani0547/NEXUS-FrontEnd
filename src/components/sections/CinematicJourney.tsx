import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  MapPinned,
  Mouse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const chapters = [
  {
    eyebrow: "01 / Observe",
    title: "See sixty-four years of Pacific agriculture move.",
    copy: "Travel through crop and livestock records as patterns rise, fall, and connect across time.",
    cta: "Enter Explorer",
    to: "/explorer" as const,
    icon: BarChart3,
    color: "#00ffd1",
  },
  {
    eyebrow: "02 / Locate",
    title: "Cross the ocean from country to country.",
    copy: "Move from regional signals to country profiles and understand where every data point belongs.",
    cta: "Open Pacific Map",
    to: "/map" as const,
    icon: MapPinned,
    color: "#38bdf8",
  },
  {
    eyebrow: "03 / Understand",
    title: "Turn the signal into a question.",
    copy: "Ask Nexus AI to explain the data, compare places, and surface the story hiding inside the numbers.",
    cta: "Ask Nexus AI",
    to: "/ai" as const,
    icon: BrainCircuit,
    color: "#a78bfa",
  },
];

function createSeededRandom(seed = 42) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function CinematicJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const activeChapter = Math.min(chapters.length - 1, Math.round(progress * (chapters.length - 1)));

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const next = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      progressRef.current = next;
      setProgress(next);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03001c, 0.055);

    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const world = new THREE.Group();
    scene.add(world);

    const globeGeometry = new THREE.IcosahedronGeometry(2.35, 3);
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00d9c0,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const globe = new THREE.Mesh(
      globeGeometry,
      globeMaterial,
    );
    globe.position.set(2.8, 0.15, -1.6);
    world.add(globe);

    const globeCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x062a3b,
      transparent: true,
      opacity: 0.72,
    });
    const globeCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.25, 3),
      globeCoreMaterial,
    );
    globe.add(globeCore);

    const random = createSeededRandom();
    const particleCount = 900;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let index = 0; index < particleCount; index += 1) {
      particlePositions[index * 3] = (random() - 0.5) * 22;
      particlePositions[index * 3 + 1] = (random() - 0.5) * 13;
      particlePositions[index * 3 + 2] = (random() - 0.5) * 22;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.035,
      transparent: true,
      opacity: 0.72,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(
      particlesGeometry,
      particlesMaterial,
    );
    world.add(particles);

    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: chapters[0].color,
      transparent: true,
      opacity: 0.45,
    });
    const orbit = new THREE.Mesh(
      new THREE.TorusGeometry(2.78, 0.018, 10, 180),
      orbitMaterial,
    );
    orbit.rotation.set(1.08, 0.28, -0.18);
    globe.add(orbit);

    const countries = [
      [-18.1, 178.4], [-6.3, 147.2], [-9.6, 160.2], [-15.4, 167.2],
      [-13.8, -172.1], [-21.2, -175.2], [1.9, -157.4], [7.4, 151.8],
      [7.5, 134.6], [7.1, 171.2], [-0.5, 166.9], [-8.5, 179.2],
      [-21.2, -159.8], [-19.1, -169.9], [-21.3, 165.5], [-17.7, -149.4],
    ];
    const countryPositions = countries.map(([lat, lon]) => {
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      const radius = 2.4;
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      );
    });

    const nodeGeometry = new THREE.SphereGeometry(0.055, 10, 10);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const countryNodes = countryPositions.map((position) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.copy(position);
      globe.add(node);
      return node;
    });

    const networkPositions: number[] = [];
    const networkLinks = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 11], [0, 14],
      [1, 2], [2, 3], [3, 10], [4, 5], [4, 7], [5, 13], [6, 8],
      [7, 9], [9, 10], [12, 15], [14, 15],
    ];
    networkLinks.forEach(([start, end]) => {
      networkPositions.push(...countryPositions[start].toArray(), ...countryPositions[end].toArray());
    });

    const networkGeometry = new THREE.BufferGeometry();
    networkGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(networkPositions, 3),
    );
    const networkMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
    });
    globe.add(new THREE.LineSegments(networkGeometry, networkMaterial));

    const applySceneTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      const background = dark ? 0x03001c : 0xf8fafc;

      renderer.setClearColor(background, 1);
      scene.fog?.color.setHex(background);
      globeMaterial.color.setHex(dark ? 0x00d9c0 : 0x087f78);
      globeMaterial.opacity = dark ? 0.22 : 0.3;
      globeCoreMaterial.color.setHex(dark ? 0x062a3b : 0xd8f3f1);
      globeCoreMaterial.opacity = dark ? 0.72 : 0.78;
      particlesMaterial.color.setHex(dark ? 0x7dd3fc : 0x0369a1);
      particlesMaterial.opacity = dark ? 0.72 : 0.38;
      nodeMaterial.color.setHex(dark ? 0xffffff : 0x0f172a);
      networkMaterial.opacity = dark ? 0.28 : 0.42;
    };

    applySceneTheme();
    const themeObserver = new MutationObserver(applySceneTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const pointer = new THREE.Vector2();
    const handlePointer = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });

    const clock = new THREE.Clock();
    let frame = 0;
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const scroll = progressRef.current;
      const chapterPosition = scroll * (chapters.length - 1);

      camera.position.z += (10.5 - scroll * 10.5 - camera.position.z) * 0.045;
      camera.position.x += (pointer.x * 0.32 + Math.sin(scroll * Math.PI * 2) * 0.7 - camera.position.x) * 0.04;
      camera.position.y += (-pointer.y * 0.2 + Math.cos(scroll * Math.PI * 2) * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, -5.5);

      globe.rotation.y = elapsed * 0.12 + scroll * Math.PI * 1.8;
      globe.rotation.x = Math.sin(elapsed * 0.22) * 0.08 + scroll * 0.35;
      globe.position.z = -1.5 - scroll * 8;
      particles.rotation.y = elapsed * 0.018 + scroll * 0.8;
      particles.position.z = scroll * 3;
      orbit.rotation.z = elapsed * 0.08 + scroll * 0.7;

      const lowerChapter = Math.floor(chapterPosition);
      const upperChapter = Math.min(chapters.length - 1, lowerChapter + 1);
      const chapterMix = chapterPosition - lowerChapter;
      orbitMaterial.color.lerpColors(
        new THREE.Color(chapters[lowerChapter].color),
        new THREE.Color(chapters[upperChapter].color),
        chapterMix,
      );
      networkMaterial.color.copy(orbitMaterial.color);
      countryNodes.forEach((node, index) => {
        const pulse = 1 + Math.sin(elapsed * 2.2 + index * 0.65) * 0.22;
        node.scale.setScalar(pulse);
      });

      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      globeGeometry.dispose();
      particlesGeometry.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      networkGeometry.dispose();
      networkMaterial.dispose();
      orbitMaterial.dispose();
      globeMaterial.dispose();
      globeCoreMaterial.dispose();
      particlesMaterial.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    };
  }, []);

  const jumpToChapter = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollable = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + scrollable * (index / (chapters.length - 1)),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative h-[340vh]"
      style={{
        background: "var(--journey-bg)",
        color: "var(--journey-foreground)",
      }}
      aria-label="Explore the NEXUS platform"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--journey-overlay)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: "var(--journey-edge-top)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
          style={{ background: "var(--journey-edge-bottom)" }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 py-24">
          <div className="relative w-full max-w-2xl min-h-[27rem]">
            {chapters.map((chapter, index) => {
              const target = index / (chapters.length - 1);
              const distance = Math.abs(progress - target);
              const visible = Math.max(0, 1 - distance * 3.2);
              const direction = target - progress;
              const Icon = chapter.icon;

              return (
                <article
                  key={chapter.title}
                  className="absolute inset-x-0 top-20 bottom-14 flex flex-col justify-center border-l pl-6 md:top-24 md:bottom-20 md:pl-9 transition-[opacity,filter] duration-150"
                  style={{
                    borderColor: chapter.color,
                    opacity: visible,
                    filter: `blur(${Math.min(8, distance * 12)}px)`,
                    transform: `translate3d(0, ${direction * 150}px, ${-distance * 240}px) rotateX(${direction * -12}deg)`,
                    pointerEvents: visible > 0.6 ? "auto" : "none",
                  }}
                  aria-hidden={visible <= 0.6}
                >
                  <div
                    className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em]"
                    style={{ color: chapter.color }}
                  >
                    <Icon className="h-4 w-4" />
                    {chapter.eyebrow}
                  </div>
                  <h2 className="max-w-xl font-display text-4xl font-semibold leading-tight md:text-6xl">
                    {chapter.title}
                  </h2>
                  <p
                    className="mt-6 max-w-lg text-base leading-7 md:text-lg"
                    style={{ color: "var(--journey-copy)" }}
                  >
                    {chapter.copy}
                  </p>
                  <Link
                    to={chapter.to}
                    className="mt-8 inline-flex h-12 items-center gap-3 border px-5 font-mono text-sm font-semibold uppercase tracking-wider transition-colors"
                    style={{
                      color: "var(--journey-foreground)",
                      borderColor: "var(--journey-button-border)",
                      background: "var(--journey-button-bg)",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background = "var(--journey-button-hover)";
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = "var(--journey-button-bg)";
                    }}
                  >
                    {chapter.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="absolute bottom-8 left-6 z-20 hidden items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] md:flex"
          style={{ color: "var(--journey-control)" }}
        >
          <Mouse className="h-4 w-4" />
          Scroll through the signal
        </div>

        <div className="absolute right-5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4 md:right-10">
          {chapters.map((chapter, index) => (
            <button
              key={chapter.eyebrow}
              type="button"
              onClick={() => jumpToChapter(index)}
              className="group relative flex h-7 w-7 items-center justify-center"
              aria-label={`Go to ${chapter.eyebrow}`}
              aria-current={activeChapter === index ? "step" : undefined}
            >
              <span
                className="block rounded-full border transition-all duration-300"
                style={{
                  width: activeChapter === index ? 12 : 6,
                  height: activeChapter === index ? 12 : 6,
                  borderColor: activeChapter === index ? chapter.color : "var(--journey-control-border)",
                  background: activeChapter === index ? chapter.color : "transparent",
                  boxShadow: activeChapter === index ? `0 0 18px ${chapter.color}` : "none",
                }}
              />
            </button>
          ))}
          <div className="h-20 w-px" style={{ background: "var(--journey-button-border)" }}>
            <div
              className="w-px bg-[#00ffd1] transition-[height] duration-100"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
        </div>

        <div
          className="absolute right-6 top-24 z-20 font-mono text-[10px] uppercase tracking-[0.28em] md:right-10"
          style={{ color: "var(--journey-control)" }}
        >
          NEXUS / Journey
        </div>
      </div>
    </section>
  );
}
