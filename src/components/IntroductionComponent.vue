<template>
  <div class="intro">
    <p
      v-for="paragraph in introduction.paragraphs"
      :key="paragraph"
      class="intro-paragraph"
    >
      <template
        v-for="(part, index) in formatIntroduction(paragraph)"
        :key="`${paragraph}-${index}`"
      >
        <strong v-if="part.highlight">{{ part.text }}</strong>
        <span v-else>{{ part.text }}</span>
      </template>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { introduction } from "@/data/profile";

interface IntroTextPart {
  text: string;
  highlight: boolean;
}

const formatIntroduction = (paragraph: string): IntroTextPart[] => {
  const highlights = new Set(introduction.highlights);
  const escaped = introduction.highlights.map((text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const matcher = new RegExp(`(${escaped.join("|")})`, "g");

  return paragraph
    .split(matcher)
    .filter(Boolean)
    .map((text) => ({
      text,
      highlight: highlights.has(text),
    }));
};

export default defineComponent({
  name: "IntroductionComponent",
  setup() {
    return {
      formatIntroduction,
      introduction,
    };
  },
});
</script>

<style scoped>
.intro {
  width: min(100%, 1080px);
  margin: 0 auto;
  text-align: left;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1rem, 1.8vh, 1.15rem);
  font-weight: 400;
  line-height: 1.8;
  color: var(--text-primary);
}

.intro-paragraph {
  margin: 0;
}

.intro-paragraph + .intro-paragraph {
  margin-top: 0.5rem;
}

strong {
  color: var(--highlight-blue);
  font-weight: 800;
}
</style>
