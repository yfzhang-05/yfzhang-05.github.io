<template>
  <section class="portfolio-container" aria-labelledby="portfolio-title">
    <h2 id="portfolio-title" class="section-title">Portfolio</h2>
    <p v-if="!portfolioItems.length" class="empty-state">
      Portfolio items will be added soon.
    </p>
    <div v-else class="portfolio-content">
      <article
        v-for="item in portfolioItems"
        :key="item.title"
        class="portfolio-item"
      >
        <figure class="portfolio-image">
          <img
            :src="item.image"
            :alt="`${item.title} thumbnail`"
            width="1600"
            height="724"
            loading="eager"
            decoding="async"
            fetchpriority="high"
          />
        </figure>
        <div class="portfolio-info">
          <h3 class="portfolio-title">{{ item.title }}</h3>
          <p class="pub-authors">
            <template v-for="(author, index) in item.authors" :key="author">
              <span
                :class="{ 'author-myself': isHighlighted(item, author) }"
              >
                {{ author }}</span
              ><span v-if="index < item.authors.length - 1">, </span>
            </template>
          </p>
          <p class="pub-venue">
            <span class="venue-tag">{{ item.venueTag }}</span>
            <span class="venue-detail">
              {{ item.venue }}, {{ item.year }}
            </span>
          </p>
          <div class="pub-links" aria-label="Portfolio resources">
            <component
              :is="link.href ? 'a' : 'span'"
              v-for="link in item.links"
              :key="link.label"
              :href="link.href"
              :target="link.href ? '_blank' : undefined"
              :rel="link.href ? 'noopener noreferrer' : undefined"
              :class="['link-item', { disabled: !link.href }]"
              :aria-disabled="!link.href"
            >
              [
              <img
                :src="link.icon"
                class="link-icon"
                alt=""
                aria-hidden="true"
              />
              {{ link.label }} ]
            </component>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { portfolioItems, type PortfolioItem } from "@/data/profile";

const isHighlighted = (item: PortfolioItem, author: string) =>
  item.highlightedAuthors.includes(author);

export default defineComponent({
  name: "PublicationComponent",
  setup() {
    return {
      isHighlighted,
      portfolioItems,
    };
  },
});
</script>

<style scoped>
.portfolio-container {
  width: min(100%, 1080px);
  margin: 0 auto;
  text-align: left;
  padding-top: clamp(1.2rem, 2vh, 1.8rem);
}

.section-title {
  font-family: "Abhaya Libre", Georgia, serif;
  font-size: clamp(1.6rem, 3vh, 2rem);
  font-weight: 600;
  margin: 0 0 1.2rem;
  color: var(--text-primary);
}

.empty-state {
  margin: 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1rem, 1.8vh, 1.15rem);
  color: var(--text-secondary);
  line-height: 1.7;
}

.portfolio-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.portfolio-item {
  display: grid;
  grid-template-columns: minmax(16rem, 23rem) 1fr;
  gap: clamp(1rem, 2vw, 1.6rem);
  padding: 0.4rem 0 1rem;
}

.portfolio-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  margin: 0;
  background-color: var(--surface-muted);
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.portfolio-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.portfolio-title {
  margin: 0;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: clamp(1.12rem, 2.1vh, 1.35rem);
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.35;
}

.pub-authors {
  margin: 0;
  font-family: "Abhaya Libre", Georgia, serif;
  font-size: clamp(1rem, 2vh, 1.22rem);
  color: var(--text-primary);
  line-height: 1.5;
}

.author-myself {
  font-family: "Abhaya Libre", Georgia, serif;
  font-weight: 600;
  text-decoration: underline;
}

.pub-venue {
  margin: 0;
  font-family: "Roboto", "Inter", sans-serif;
  font-size: clamp(0.95rem, 1.8vh, 1.1rem);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.venue-tag {
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-family: "Roboto", "Inter", sans-serif;
  color: var(--text-primary);
}

.venue-detail {
  font-family: "Roboto", "Inter", sans-serif;
  color: var(--text-primary);
  font-style: italic;
}

.pub-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.1rem;
}

.link-item {
  font-family: "Roboto", "Inter", sans-serif;
  font-size: clamp(0.95rem, 1.8vh, 1.1rem);
  color: var(--text-primary);
  text-decoration: none;
}

.link-item:not(.disabled):hover {
  text-decoration: underline;
}

.link-item.disabled {
  cursor: not-allowed;
  color: var(--text-muted);
}

.link-icon {
  width: 1.1rem;
  height: 1.1rem;
  vertical-align: -0.2rem;
}

@media (max-width: 760px) {
  .portfolio-item {
    grid-template-columns: 1fr;
  }
}
</style>
