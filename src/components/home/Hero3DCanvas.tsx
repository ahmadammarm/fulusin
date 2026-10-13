"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Hero3DCanvas() {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isWebGLSupported, setIsWebGLSupported] = useState(true);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        // Check WebGL availability
        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            if (!gl) {
                setIsWebGLSupported(false);
                return;
            }
        } catch {
            setIsWebGLSupported(false);
            return;
        }

        // Check reduced motion preference
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 7.5);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        // Key Light (Teal / Cyan)
        const tealPoint = new THREE.PointLight(0x14b8a6, 25, 20);
        tealPoint.position.set(4, 3, 4);
        scene.add(tealPoint);

        // Rim Light (Emerald / Mint)
        const emeraldPoint = new THREE.PointLight(0x10b981, 18, 20);
        emeraldPoint.position.set(-4, -2, 3);
        scene.add(emeraldPoint);

        // Accent Top Light (White Glare)
        const topLight = new THREE.DirectionalLight(0xffffff, 1.4);
        topLight.position.set(0, 5, 5);
        scene.add(topLight);

        // 3D Objects Group
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // Helper: Create Rounded Rect Shape for Credit/Ledger Card
        function createRoundedRectShape(w: number, h: number, r: number) {
            const shape = new THREE.Shape();
            const x = -w / 2;
            const y = -h / 2;
            shape.moveTo(x + r, y);
            shape.lineTo(x + w - r, y);
            shape.quadraticCurveTo(x + w, y, x + w, y + r);
            shape.lineTo(x + w, y + h - r);
            shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            shape.lineTo(x + r, y + h);
            shape.quadraticCurveTo(x, y + h, x, y + h - r);
            shape.lineTo(x, y + r);
            shape.quadraticCurveTo(x, y, x + r, y);
            return shape;
        }

        // Extrude geometry for the Primary Glass Card
        const cardShape = createRoundedRectShape(3.2, 2.0, 0.18);
        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
            depth: 0.08,
            bevelEnabled: true,
            bevelSegments: 4,
            steps: 1,
            bevelSize: 0.03,
            bevelThickness: 0.03,
        };
        const cardGeometry = new THREE.ExtrudeGeometry(cardShape, extrudeSettings);

        // Primary Card Material (Translucent Smoked Glass with Teal sheen)
        const primaryCardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0f172a,
            emissive: 0x0d9488,
            emissiveIntensity: 0.15,
            metalness: 0.6,
            roughness: 0.25,
            transmission: 0.65,
            thickness: 0.8,
            transparent: true,
            opacity: 0.9,
            reflectivity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
        });

        const primaryCard = new THREE.Mesh(cardGeometry, primaryCardMaterial);
        primaryCard.position.set(-0.2, 0.1, 0.4);
        primaryCard.rotation.set(-0.15, 0.25, 0.08);
        mainGroup.add(primaryCard);

        // Card Chip Accent Geometry (Golden / Metallic microchip)
        const chipShape = createRoundedRectShape(0.48, 0.38, 0.05);
        const chipGeometry = new THREE.ExtrudeGeometry(chipShape, {
            depth: 0.02,
            bevelEnabled: true,
            bevelSegments: 2,
            bevelSize: 0.01,
            bevelThickness: 0.01,
        });
        const chipMaterial = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.3,
        });
        const chip = new THREE.Mesh(chipGeometry, chipMaterial);
        chip.position.set(-0.9, 0.35, 0.1);
        primaryCard.add(chip);

        // Contactless payment wave / logo accent
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0x2dd4bf,
            transparent: true,
            opacity: 0.8,
        });
        const waveGeo = new THREE.TorusGeometry(0.18, 0.015, 8, 24, Math.PI * 0.6);
        const waveMesh = new THREE.Mesh(waveGeo, waveMaterial);
        waveMesh.position.set(-0.35, 0.35, 0.1);
        primaryCard.add(waveMesh);

        // Secondary Background Card (Holographic Mint Frame)
        const secondaryCardMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x042f2e,
            emissive: 0x14b8a6,
            emissiveIntensity: 0.25,
            metalness: 0.5,
            roughness: 0.35,
            transmission: 0.75,
            transparent: true,
            opacity: 0.75,
            clearcoat: 0.8,
        });
        const secondaryCard = new THREE.Mesh(cardGeometry, secondaryCardMaterial);
        secondaryCard.position.set(0.6, -0.4, -0.6);
        secondaryCard.rotation.set(-0.05, -0.25, -0.12);
        mainGroup.add(secondaryCard);

        // Floating 3D Coin 1 (Teal / Fulusin Currency Token)
        const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.08, 36);
        const coinMaterial = new THREE.MeshStandardMaterial({
            color: 0x14b8a6,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0x0f766e,
            emissiveIntensity: 0.3,
        });
        const coin1 = new THREE.Mesh(coinGeometry, coinMaterial);
        coin1.position.set(1.9, 1.2, 0.8);
        coin1.rotation.set(Math.PI / 3, 0, Math.PI / 4);
        mainGroup.add(coin1);

        // Floating 3D Coin 2 (Gold Inflow Token)
        const goldCoinMaterial = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            metalness: 0.9,
            roughness: 0.25,
            emissive: 0xb45309,
            emissiveIntensity: 0.2,
        });
        const coin2 = new THREE.Mesh(coinGeometry, goldCoinMaterial);
        coin2.scale.set(0.7, 0.7, 0.7);
        coin2.position.set(-2.0, -1.2, 0.5);
        coin2.rotation.set(-Math.PI / 4, Math.PI / 6, 0);
        mainGroup.add(coin2);

        // Floating Holographic Rings around Coin 1
        const ringGeo = new THREE.TorusGeometry(0.75, 0.015, 12, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x2dd4bf,
            transparent: true,
            opacity: 0.5,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(coin1.position);
        ring.rotation.set(Math.PI / 2.5, 0, 0);
        mainGroup.add(ring);

        // Ambient Particles / Floating Sparkle Dots
        const particleCount = 45;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            particlePositions[i] = (Math.random() - 0.5) * 8;
            particlePositions[i + 1] = (Math.random() - 0.5) * 6;
            particlePositions[i + 2] = (Math.random() - 0.5) * 4;
        }

        particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x5eead4,
            size: 0.04,
            transparent: true,
            opacity: 0.6,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Interactive Mouse Tracking with Smooth Damping
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            mouseX = (x / rect.width - 0.5) * 2;
            mouseY = (y / rect.height - 0.5) * 2;
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });

        // Animation Loop with Visibility Optimization
        let isVisible = true;
        let animationFrameId: number;
        const clock = new THREE.Clock();

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(container);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isVisible) return;

            const elapsedTime = clock.getElapsedTime();

            if (!prefersReducedMotion) {
                // Smooth Mouse Interpolation (Lerp)
                targetX += (mouseX * 0.45 - targetX) * 0.05;
                targetY += (mouseY * 0.35 - targetY) * 0.05;

                // Subtle Idle Floating + Mouse Tilt
                mainGroup.rotation.y = targetX + Math.sin(elapsedTime * 0.6) * 0.05;
                mainGroup.rotation.x = -targetY + Math.cos(elapsedTime * 0.5) * 0.04;

                // Gentle Coin Rotation
                coin1.rotation.y += 0.015;
                coin1.rotation.z += 0.008;
                coin2.rotation.y += 0.012;
                coin2.rotation.x -= 0.01;

                ring.rotation.z -= 0.01;

                // Floating vertical breath
                primaryCard.position.y = 0.1 + Math.sin(elapsedTime * 0.8) * 0.06;
                secondaryCard.position.y = -0.4 + Math.cos(elapsedTime * 0.7) * 0.05;
                coin1.position.y = 1.2 + Math.sin(elapsedTime * 1.1) * 0.08;
                coin2.position.y = -1.2 + Math.cos(elapsedTime * 0.9) * 0.07;
                ring.position.y = coin1.position.y;

                // Slowly rotate particles
                particles.rotation.y = elapsedTime * 0.02;
                particles.rotation.x = elapsedTime * 0.01;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Responsive Resize Handler
        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup on unmount
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            // Dispose Geometries and Materials
            cardGeometry.dispose();
            chipGeometry.dispose();
            waveGeo.dispose();
            coinGeometry.dispose();
            ringGeo.dispose();
            particleGeo.dispose();

            primaryCardMaterial.dispose();
            secondaryCardMaterial.dispose();
            chipMaterial.dispose();
            waveMaterial.dispose();
            coinMaterial.dispose();
            goldCoinMaterial.dispose();
            ringMat.dispose();
            particleMat.dispose();

            renderer.dispose();
        };
    }, []);

    if (!isWebGLSupported) {
        return null;
    }

    return (
        <div
            ref={mountRef}
            className="w-full h-full min-h-[360px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center pointer-events-none select-none relative"
            aria-hidden="true"
        />
    );
}
