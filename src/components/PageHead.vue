<template>
  <header class="site-header">
    <div class="left-section">
      <a class="name" href="#about" @click="setActiveSection('about')">
        {{ profile.name }}
      </a>
    </div>
    <nav class="right-section" aria-label="Primary navigation">
      <div class="breadcrumb" role="list">
        <a
          v-for="item in navItems"
          :key="item.id"
          :class="{ active: activeSection === item.id }"
          :href="`#${item.id}`"
          role="listitem"
          @click="setActiveSection(item.id)"
          >{{ item.label }}</a
        >
        <button
          class="love-nav"
          type="button"
          @click="openLoveGate"
        >
          520限定
        </button>
      </div>
      <div class="actions">
        <button
          class="btn-theme"
          type="button"
          :aria-label="themeLabel"
          @click="toggleTheme"
        >
          <img :src="themeIcon" class="theme-icon" alt="" aria-hidden="true" />
        </button>
      </div>
    </nav>
    <div v-if="showGate" class="love-overlay" role="dialog" aria-modal="true">
      <form class="love-dialog" @submit.prevent="verifyLoveAnswer">
        <div class="dialog-sparkles" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <label class="love-question" for="love-answer">你是谁？</label>
        <input
          id="love-answer"
          ref="answerInputRef"
          v-model="loveAnswer"
          class="love-input"
          autocomplete="off"
          type="text"
        />
        <div class="dialog-actions">
          <button class="dialog-button secondary" type="button" @click="closeGate">
            取消
          </button>
          <button class="dialog-button primary" type="submit">进入</button>
        </div>
      </form>
    </div>
    <div
      v-if="showWrongAlert"
      class="love-overlay"
      role="alertdialog"
      aria-modal="true"
    >
      <div class="love-dialog alert-dialog">
        <div class="alert-heart" aria-hidden="true"></div>
        <p class="alert-text">你不是我的宝宝！</p>
        <button class="dialog-button primary" type="button" @click="closeWrongAlert">
          好吧
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
import darkIcon from "@/assets/icons/dark.svg";
import lightIcon from "@/assets/icons/light.svg";
import { navItems, profile, type SectionId } from "@/data/profile";

export default defineComponent({
  name: "PageHead",
  setup() {
    const activeSection = ref<SectionId>("about");
    const answerInputRef = ref<HTMLInputElement | null>(null);
    const isDarkTheme = ref(false);
    const loveAnswer = ref("");
    const showGate = ref(false);
    const showWrongAlert = ref(false);
    let isManualClick = false;
    let animationFrame = 0;

    const applyTheme = () => {
      document.documentElement.classList.toggle(
        "dark-theme",
        isDarkTheme.value
      );
      localStorage.setItem("theme", isDarkTheme.value ? "dark" : "light");
    };

    const toggleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
      applyTheme();
    };

    const setActiveSection = (section: SectionId) => {
      activeSection.value = section;
      isManualClick = true;
      setTimeout(() => {
        isManualClick = false;
      }, 400);
    };

    const openLoveGate = async () => {
      loveAnswer.value = "";
      showWrongAlert.value = false;
      showGate.value = true;
      await nextTick();
      answerInputRef.value?.focus();
    };

    const closeGate = () => {
      showGate.value = false;
      loveAnswer.value = "";
    };

    const closeWrongAlert = async () => {
      showWrongAlert.value = false;
      showGate.value = true;
      loveAnswer.value = "";
      await nextTick();
      answerInputRef.value?.focus();
    };

    const verifyLoveAnswer = () => {
      if (loveAnswer.value.trim() === "张一凡") {
        showGate.value = false;
        window.location.hash = "love-520";
        return;
      }

      showGate.value = false;
      showWrongAlert.value = true;
    };

    const checkScroll = () => {
      if (isManualClick) return;

      const headerOffset = window.innerHeight * 0.061 + 16;
      for (const { id } of navItems) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= headerOffset && rect.bottom >= headerOffset) {
          activeSection.value = id;
          break;
        }
      }
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        checkScroll();
      });
    };

    onMounted(() => {
      isDarkTheme.value = localStorage.getItem("theme") === "dark";
      applyTheme();
      window.addEventListener("scroll", onScroll, { passive: true });
      checkScroll();
    });

    onUnmounted(() => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    });

    const themeIcon = computed(() =>
      isDarkTheme.value ? lightIcon : darkIcon
    );
    const themeLabel = computed(() =>
      isDarkTheme.value ? "Switch to light theme" : "Switch to dark theme"
    );

    return {
      activeSection,
      answerInputRef,
      closeGate,
      closeWrongAlert,
      navItems,
      loveAnswer,
      openLoveGate,
      profile,
      setActiveSection,
      showGate,
      showWrongAlert,
      themeIcon,
      themeLabel,
      toggleTheme,
      verifyLoveAnswer,
    };
  },
});
</script>

<style scoped>
.site-header {
  width: 100%;
  height: 100%;
  padding: 0 clamp(1rem, 3vw, 3rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-primary);
  box-sizing: border-box;
}

.left-section {
  font-size: clamp(1.6rem, 3vh, 2.3rem);
  font-weight: 400;
  font-family: "Carattere", "Yaldevi", cursive;
  line-height: 1;
}

.name {
  color: var(--text-primary);
  text-decoration: none;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 1.5vw;
}

.breadcrumb {
  font-family: "Inter", sans-serif;
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1.3rem);
  font-size: clamp(0.95rem, 2.1vh, 1.2rem);
}

.breadcrumb a {
  text-decoration: none;
  color: var(--text-muted);
  position: relative;
  transition: color 0.2s ease;
  font-weight: 300;
}

.love-nav {
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  color: #fb6a4a;
  cursor: pointer;
  font: inherit;
  font-weight: 650;
  position: relative;
}

.love-nav:hover {
  text-shadow: 0 0 12px rgba(251, 106, 74, 0.36);
}

.breadcrumb a.active {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb a:not(:last-child):after {
  content: " / ";
  right: calc(clamp(0.75rem, 1.5vw, 1.3rem) / -1.6);
  position: absolute;
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-theme {
  background-color: var(--theme-button-bg);
  cursor: pointer;
  border: 1px solid var(--theme-button-border);
  border-radius: 6px;
  display: grid;
  place-items: center;
  height: 2rem;
  width: 2rem;
  transition: background-color 0.2s ease;
}

.btn-theme:hover {
  background-color: var(--button-hover-bg);
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.love-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    radial-gradient(circle at 32% 20%, rgba(255, 255, 255, 0.62), transparent 23rem),
    rgba(251, 106, 74, 0.2);
  backdrop-filter: blur(10px);
}

.love-dialog {
  position: relative;
  width: min(100%, 25rem);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.68);
  border-radius: 1.4rem;
  padding: 2rem;
  background:
    linear-gradient(145deg, rgba(255, 245, 240, 0.96), rgba(254, 224, 210, 0.94)),
    #fff5f0;
  box-shadow:
    0 28px 70px rgba(251, 106, 74, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.72);
  animation: dialogIn 0.42s cubic-bezier(0.18, 0.8, 0.22, 1);
}

.love-question {
  display: block;
  margin-bottom: 1rem;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1.45rem, 4vw, 2rem);
  font-weight: 800;
  color: #fb6a4a;
  text-align: center;
}

.love-input {
  width: 100%;
  height: 3rem;
  border: 1px solid rgba(251, 106, 74, 0.32);
  border-radius: 0.9rem;
  padding: 0 1rem;
  box-sizing: border-box;
  outline: none;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: 1.08rem;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.56);
}

.love-input:focus {
  border-color: #fb6a4a;
  box-shadow:
    0 0 0 4px rgba(251, 106, 74, 0.14),
    inset 0 0 0 1px rgba(255, 255, 255, 0.72);
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 0.85rem;
  margin-top: 1.35rem;
}

.dialog-button {
  min-width: 5.5rem;
  border: 1px solid rgba(251, 106, 74, 0.22);
  border-radius: 999px;
  padding: 0.62rem 1.1rem;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: 0.98rem;
  cursor: pointer;
}

.dialog-button.primary {
  color: #ffffff;
  background: linear-gradient(135deg, #fb6a4a, #f03b20);
  box-shadow: 0 12px 26px rgba(251, 106, 74, 0.3);
}

.dialog-button.secondary {
  color: #fb6a4a;
  background: rgba(255, 255, 255, 0.68);
}

.dialog-sparkles span {
  position: absolute;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 22px rgba(251, 106, 74, 0.8);
  animation: sparkle 2.4s ease-in-out infinite;
}

.dialog-sparkles span:nth-child(1) {
  top: 1rem;
  left: 1.4rem;
}

.dialog-sparkles span:nth-child(2) {
  top: 1.6rem;
  right: 2rem;
  animation-delay: 0.5s;
}

.dialog-sparkles span:nth-child(3) {
  right: 3rem;
  bottom: 1.2rem;
  animation-delay: 1s;
}

.alert-dialog {
  display: grid;
  justify-items: center;
  gap: 1rem;
}

.alert-heart {
  width: 3rem;
  height: 3rem;
  background: #fb6a4a;
  transform: rotate(45deg);
  box-shadow: 0 0 30px rgba(251, 106, 74, 0.46);
  animation: heartBeat 1.05s ease-in-out infinite;
}

.alert-heart::before,
.alert-heart::after {
  content: "";
  position: absolute;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: #fb6a4a;
}

.alert-heart::before {
  left: -1.5rem;
}

.alert-heart::after {
  top: -1.5rem;
}

.alert-text {
  margin: 0.6rem 0 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1.25rem, 4vw, 1.7rem);
  font-weight: 800;
  color: #fb6a4a;
  text-align: center;
}

@keyframes dialogIn {
  from {
    opacity: 0;
    transform: translateY(1rem) scale(0.94);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(0.65);
  }

  50% {
    opacity: 1;
    transform: scale(1.25);
  }
}

@keyframes heartBeat {
  0%,
  100% {
    transform: rotate(45deg) scale(1);
  }

  50% {
    transform: rotate(45deg) scale(1.12);
  }
}

@media (max-width: 640px) {
  .site-header {
    padding: 0 1rem;
  }

  .breadcrumb {
    gap: 0.75rem;
  }

  .breadcrumb a:not(:last-child):after {
    right: -0.5rem;
  }

  .love-dialog {
    padding: 1.6rem;
  }
}
</style>
