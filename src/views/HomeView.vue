<script lang="ts">
import BoulderList from '@/components/BoulderList.vue'

export default {
  name: 'HomeView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  components: {
    BoulderList,
  },
}
</script>

<template>
  <BoulderList :url="url" />
</template>
