<script lang="ts">
import UserBoulderList from '@/components/UserBoulderList.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserProgress from '@/components/UserProgress.vue'

export default {
  name: 'UserView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      qntBoulders: 0,
    }
  },
  methods: {
    handleQntboulders(len: number) {
      this.qntBoulders = len
    },
  },
  components: {
    UserInfo,
    UserProgress,
    UserBoulderList,
  },
}
</script>

<template>
  <UserProgress :len="qntBoulders" />
  <div class="userInfo">
    <UserInfo />
    <UserBoulderList :url="url" @qntBoulders="handleQntboulders" />
  </div>
</template>

<style scoped>
.userInfo {
  padding: 2rem;
  display: flex;
  align-items: flex-start;
}
</style>
