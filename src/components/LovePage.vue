<template>
  <main class="love-page" @pointermove="handlePointerMove">
    <canvas ref="canvasRef" class="particle-canvas" aria-hidden="true"></canvas>
    <div class="glow glow-one"></div>
    <div class="glow glow-two"></div>
    <div class="glow glow-three"></div>
    <button class="home-link" type="button" @click="goHome">Yifan Zhang</button>
    <section class="love-content" aria-live="polite">
      <p class="phase-label">{{ phaseLabel }}</p>
      <h1 :class="['love-message', { visible: messageVisible }]">
        {{ activeMessage }}
      </h1>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  size: number;
  hue: number;
  lightness: number;
  alpha: number;
  sparkle: number;
}

const messages = [
  "祝凡凡宝宝520快乐",
  "我爱你！",
  "我们永远幸福！",
];

export default defineComponent({
  name: "LovePage",
  setup() {
    const canvasRef = ref<HTMLCanvasElement | null>(null);
    const phaseLabel = ref("520 Limited");
    const activeMessage = ref("");
    const messageVisible = ref(false);
    const pointer = { x: -9999, y: -9999 };
    const particles: Particle[] = [];
    const timers: number[] = [];
    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let deviceRatio = 1;

    const createParticle = (targetX: number, targetY: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0,
      vy: 0,
      tx: targetX,
      ty: targetY,
      size: Math.random() * 1.7 + 1.1,
      hue: 345 + Math.random() * 35,
      lightness: 64,
      alpha: 0.68 + Math.random() * 0.32,
      sparkle: Math.random() * Math.PI * 2,
    });

    const resizeCanvas = () => {
      const canvas = canvasRef.value;
      if (!canvas) return;

      deviceRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * deviceRatio);
      canvas.height = Math.floor(height * deviceRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx = canvas.getContext("2d");
      ctx?.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
    };

    const getTextTargets = (text: string, fontSize: number) => {
      const measureCanvas = document.createElement("canvas");
      const measureCtx = measureCanvas.getContext("2d");
      if (!measureCtx) return [];

      measureCanvas.width = Math.floor(width);
      measureCanvas.height = Math.floor(height);
      measureCtx.fillStyle = "#ffffff";
      measureCtx.textAlign = "center";
      measureCtx.textBaseline = "middle";
      measureCtx.font = `800 ${fontSize}px "Noto Serif SC", "Source Han Serif SC", serif`;
      measureCtx.fillText(text, width / 2, height / 2);

      const imageData = measureCtx.getImageData(0, 0, width, height).data;
      const gap = Math.max(5, Math.floor(fontSize / 23));
      const targets: Array<{ x: number; y: number }> = [];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = imageData[(y * width + x) * 4 + 3];
          if (alpha > 120) {
            targets.push({ x, y });
          }
        }
      }

      return targets;
    };

    const morphToText = (text: string, kind: "countdown" | "message") => {
      const fontSize =
        kind === "countdown"
          ? Math.min(width * 0.52, height * 0.66, 520)
          : Math.min(width * 0.095, 86);
      const targets = getTextTargets(text, fontSize);
      const maxParticles = kind === "countdown" ? 2300 : 2100;
      const selectedTargets = targets
        .sort(() => Math.random() - 0.5)
        .slice(0, maxParticles);

      while (particles.length < selectedTargets.length) {
        particles.push(createParticle(width / 2, height / 2));
      }
      while (particles.length > selectedTargets.length) {
        particles.pop();
      }

      selectedTargets.forEach((target, index) => {
        particles[index].tx = target.x;
        particles[index].ty = target.y;
        particles[index].hue =
          kind === "countdown" ? 5 + Math.random() * 2 : 330 + index * 0.03;
        particles[index].lightness =
          kind === "countdown" ? 54 + Math.random() * 4 : 62 + Math.random() * 8;
        particles[index].alpha =
          kind === "countdown" ? 0.82 + Math.random() * 0.18 : 0.68 + Math.random() * 0.32;
        particles[index].size =
          kind === "countdown" ? Math.random() * 3.2 + 2.1 : Math.random() * 1.9 + 1.1;
      });
    };

    const drawBackground = () => {
      if (!ctx) return;

      const gradient = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        20,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, "rgba(251, 106, 74, 0.22)");
      gradient.addColorStop(0.34, "rgba(254, 224, 210, 0.34)");
      gradient.addColorStop(1, "rgba(255, 245, 240, 0.96)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 34; i += 1) {
        const x = ((i * 131 + performance.now() * 0.015) % (width + 160)) - 80;
        const y = (Math.sin(i * 1.8 + performance.now() * 0.001) * 0.5 + 0.5) * height;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${0.08 + (i % 5) * 0.026})`;
        ctx.arc(x, y, 1.2 + (i % 4), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const animate = () => {
      if (!ctx) return;
      const context = ctx;

      drawBackground();
      context.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        const dx = particle.tx - particle.x;
        const dy = particle.ty - particle.y;
        const distanceToPointer = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);

        particle.vx += dx * 0.018;
        particle.vy += dy * 0.018;

        if (distanceToPointer < 120) {
          const force = (120 - distanceToPointer) / 120;
          const angle = Math.atan2(particle.y - pointer.y, particle.x - pointer.x);
          particle.vx += Math.cos(angle) * force * 2.2;
          particle.vy += Math.sin(angle) * force * 2.2;
        }

        particle.vx *= 0.82;
        particle.vy *= 0.82;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.sparkle += 0.08;

        const glow = 0.55 + Math.sin(particle.sparkle) * 0.25;
        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 92%, ${particle.lightness}%, ${
          particle.alpha * glow
        })`;
        context.shadowColor = `hsla(${particle.hue}, 100%, ${
          Math.min(particle.lightness + 16, 76)
        }%, 0.7)`;
        context.shadowBlur = 13;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      });

      context.shadowBlur = 0;
      context.globalCompositeOperation = "source-over";
      animationFrame = window.requestAnimationFrame(animate);
    };

    const schedule = (callback: () => void, delay: number) => {
      timers.push(window.setTimeout(callback, delay));
    };

    const runShow = () => {
      ["3", "2", "1"].forEach((number, index) => {
        schedule(() => {
          phaseLabel.value = "Countdown";
          activeMessage.value = "";
          messageVisible.value = false;
          morphToText(number, "countdown");
        }, index * 1180);
      });

      messages.forEach((message, index) => {
        schedule(() => {
          phaseLabel.value = "For Fanfan";
          activeMessage.value = message;
          messageVisible.value = false;
          morphToText(message, "message");
          requestAnimationFrame(() => {
            messageVisible.value = true;
          });
        }, 4300 + index * 4600);
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const goHome = () => {
      window.location.hash = "about";
    };

    onMounted(() => {
      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);
      morphToText("3", "countdown");
      animate();
      runShow();
    });

    onUnmounted(() => {
      window.removeEventListener("resize", resizeCanvas);
      timers.forEach((timer) => window.clearTimeout(timer));
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    });

    return {
      activeMessage,
      canvasRef,
      goHome,
      handlePointerMove,
      messageVisible,
      phaseLabel,
    };
  },
});
</script>

<style scoped>
.love-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  color: #fffafa;
  background:
    radial-gradient(circle at 20% 18%, rgba(255, 255, 255, 0.62), transparent 26%),
    linear-gradient(135deg, #fff5f0 0%, #fee0d2 38%, #fb6a4a 100%);
}

.particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  mix-blend-mode: screen;
  filter: blur(10px);
  z-index: 2;
}

.glow-one {
  width: 18rem;
  height: 18rem;
  left: 7%;
  top: 12%;
  background: rgba(255, 255, 255, 0.28);
  animation: floatGlow 8s ease-in-out infinite;
}

.glow-two {
  width: 24rem;
  height: 24rem;
  right: -4rem;
  bottom: 6%;
  background: rgba(251, 106, 74, 0.26);
  animation: floatGlow 10s ease-in-out infinite reverse;
}

.glow-three {
  width: 10rem;
  height: 10rem;
  left: 52%;
  bottom: 14%;
  background: rgba(255, 255, 255, 0.22);
  animation: pulseGlow 3.8s ease-in-out infinite;
}

.home-link {
  position: absolute;
  z-index: 4;
  top: clamp(1rem, 3vw, 2rem);
  right: clamp(1rem, 3vw, 2rem);
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-family: "Yaldevi", "Inter", sans-serif;
  font-size: 0.95rem;
  color: #ffffff;
  background: rgba(251, 106, 74, 0.34);
  box-shadow: 0 12px 34px rgba(251, 106, 74, 0.22);
  cursor: pointer;
  backdrop-filter: blur(14px);
}

.love-content {
  position: relative;
  z-index: 3;
  min-height: 100vh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1rem;
  padding: clamp(1rem, 5vw, 4rem);
  text-align: center;
  pointer-events: none;
}

.phase-label {
  margin: 0;
  font-family: "Carattere", "Yaldevi", cursive;
  font-size: clamp(2.3rem, 7vw, 5.8rem);
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 0 28px rgba(251, 106, 74, 0.58);
}

.love-message {
  min-height: clamp(4rem, 14vw, 8.5rem);
  margin: 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(2rem, 8vw, 6rem);
  font-weight: 900;
  line-height: 1.18;
  color: #ffffff;
  text-shadow:
    0 0 18px rgba(255, 255, 255, 0.96),
    0 0 34px rgba(251, 106, 74, 0.82),
    0 18px 44px rgba(126, 23, 23, 0.28);
  opacity: 0;
  transform: translateY(1rem) scale(0.94);
}

.love-message.visible {
  animation: revealLove 3.8s cubic-bezier(0.18, 0.8, 0.22, 1) forwards;
}

@keyframes revealLove {
  0% {
    opacity: 0;
    transform: translateY(1.3rem) scale(0.9);
    filter: blur(14px);
  }

  58% {
    opacity: 1;
    transform: translateY(0) scale(1.04);
    filter: blur(0);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}

@keyframes floatGlow {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  50% {
    transform: translate3d(1.5rem, -1.25rem, 0) scale(1.08);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.86);
  }

  50% {
    opacity: 1;
    transform: scale(1.18);
  }
}

@media (max-width: 640px) {
  .love-message {
    font-size: clamp(1.8rem, 10vw, 3.4rem);
  }
}
</style>
