<template>
  <article class="about-card">
    <div class="avatar">
      <img
        :src="`${baseUrl}photo-avatar.webp`"
        :alt="profile.avatarAlt"
        width="640"
        height="640"
        decoding="async"
        fetchpriority="high"
      />
    </div>
    <div class="info">
      <div class="intro">
        <span class="en">Hello!&nbsp;&nbsp;I'm {{ profile.name }}</span>
        <span class="cn">({{ profile.chineseName }})</span>
        <img :src="profile.logo" alt="Chongqing University" class="logo" />
      </div>
      <p class="identity">{{ profile.affiliation }}</p>
      <div class="direction" aria-label="Research interests">
        <template
          v-for="(area, index) in profile.researchAreas"
          :key="area.label"
        >
          <span>{{ area.label }}</span>
          <img
            :src="area.icon"
            :alt="`${area.label} icon`"
            class="icon"
          />
          <span v-if="index < profile.researchAreas.length - 1" class="divider">
            |
          </span>
        </template>
      </div>
      <div class="connect" aria-label="Contact and social links">
        <component
          :is="link.href ? 'a' : 'span'"
          v-for="link in profile.links"
          :key="link.label"
          :href="link.href"
          :target="link.href?.startsWith('http') ? '_blank' : undefined"
          :rel="
            link.href?.startsWith('http') ? 'noopener noreferrer' : undefined
          "
          :class="['connect-link', { disabled: !link.href }]"
          :aria-label="link.label"
          :aria-disabled="!link.href"
        >
          <img
            :src="link.icon"
            :alt="`${link.label} icon`"
            class="connect-icon"
          />
        </component>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { profile } from "@/data/profile";

export default defineComponent({
  name: "AboutComponent",
  setup() {
    return {
      baseUrl: import.meta.env.BASE_URL,
      profile,
    };
  },
});
</script>

<style scoped>
.about-card {
  width: min(100%, 1080px);
  display: flex;
  align-items: center;
  gap: clamp(1.2rem, 3vw, 2rem);
  margin: 0 auto;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: clamp(1rem, 2.4vh, 1.6rem);
  text-align: left;
  box-sizing: border-box;
}

.avatar {
  width: clamp(7.5rem, 15vh, 9.5rem);
  height: clamp(7.5rem, 15vh, 9.5rem);
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
}

.avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  min-width: 0;
}

.intro {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.65rem;
  font-family: "Yaldevi", "Noto Serif SC", "Source Han Serif SC", "Songti SC",
    serif;
  font-size: clamp(1.35rem, 2.8vh, 1.8rem);
}

.en {
  font-family: "Yaldevi", "Inter", sans-serif;
  font-weight: 550;
  color: var(--text-primary);
}

.cn,
.identity,
.direction {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1rem, 2vh, 1.22rem);
  font-weight: 400;
  color: var(--text-primary);
}

.identity {
  margin: 0 0 0.45rem;
}

.direction {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.divider {
  color: var(--text-secondary);
  padding: 0 0.15rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  vertical-align: middle;
}

.connect-icon {
  width: 1.55rem;
  height: 1.55rem;
  vertical-align: middle;
}

.connect {
  padding-top: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.logo {
  margin-left: 0.15rem;
  height: 1.55rem;
  vertical-align: middle;
}

.connect-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  border-radius: 6px;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.connect-link:hover {
  opacity: 0.78;
  transform: translateY(-1px);
}

.connect-link.disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.connect-link.disabled:hover {
  transform: none;
}

@media (max-width: 700px) {
  .about-card {
    align-items: flex-start;
  }
}

@media (max-width: 560px) {
  .about-card {
    flex-direction: column;
  }
}
</style>
