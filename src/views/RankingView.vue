<script lang="ts">
import RankingList from '@/components/RankingList.vue'

export default {
  name: 'RankingView',
  components: {
    RankingList,
  },
}
</script>

<template>
  <RankingList />
</template>

<style scoped>
.alert {
  padding: 2rem;
  display: flex;
  justify-content: center;
}
</style>
