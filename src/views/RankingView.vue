<script lang="ts">
import RankingList from '@/components/RankingList.vue'

export default {
  name: 'RankingView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  components: {
    RankingList,
  },
}
</script>

<template>
  <RankingList :url="url" />
</template>

<style scoped>
.alert {
  padding: 2rem;
  display: flex;
  justify-content: center;
}
</style>
