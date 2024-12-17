<script lang="ts">
import UserBoulderList from '@/components/UserBoulderList.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserProgress from '@/components/UserProgress.vue'
import type { User } from '@/types/user'
import { watch } from 'vue'

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
      user: null as User | null,
    }
  },
  mounted() {
    this.fetchUser()
    watch(() => this.$route, this.fetchUser)
  },
  methods: {
    fetchUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
      } else {
        this.user = null
      }
    },
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
  <UserProgress :len="qntBoulders" :score="user ? user.score : 0" />
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
