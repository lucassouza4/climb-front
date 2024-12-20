<template>
  <div class="card">
    <div class="card-body">
      <div class="info">
        <h3>SCORE</h3>
        <h4 class="text-muted">{{ user.score }}</h4>
      </div>
      |
      <div class="info">
        <h3>RANK</h3>
        <h4 class="text-muted">{{ user.rank }}</h4>
      </div>
      |
      <div class="info">
        <h3>BOULDERS</h3>
        <h4 class="text-muted">{{ len }}</h4>
      </div>
      |
      <div class="info">
        <h3>VIAS</h3>
        <h4 class="text-muted">-</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { User } from '@/types/user'

export default {
  name: 'UserProgress',
  props: {
    len: {
      type: Number,
      required: true,
    },
    user: {
      type: Object as () => User,
      required: true,
    },
  },
}
</script>

<style scoped>
.card {
  margin: 2rem;
  padding: 1rem;
  box-shadow: 0px 2px 2px 2px rgba(0, 0, 0, 0.2);
}
.card-body {
  display: flex;
  justify-content: space-evenly;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
