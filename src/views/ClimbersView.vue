<script lang="ts">
import ClimbersList from '@/components/ClimbersList.vue'

export default {
  name: 'ClimbersView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  components: {
    ClimbersList,
  },
}
</script>

<template>
  <div>
    <ClimbersList :url="url" />
  </div>
</template>

<style scoped></style>
