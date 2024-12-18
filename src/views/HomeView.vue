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
  data() {
    return {
      addBoulderSuccess: null as { success: boolean; message: string } | null,
    }
  },
  methods: {
    handleSuccess(data: { success: boolean; message: string }) {
      this.addBoulderSuccess = data
    },
  },
  components: {
    BoulderList,
  },
}
</script>

<template>
  <div v-if="addBoulderSuccess?.success === true" class="alert alert-success" role="alert">
    {{ addBoulderSuccess.message }}
  </div>
  <div v-if="addBoulderSuccess?.success === false" class="alert alert-danger" role="alert">
    {{ addBoulderSuccess.message }}
  </div>
  <BoulderList :url="url" @success="handleSuccess" />
</template>
