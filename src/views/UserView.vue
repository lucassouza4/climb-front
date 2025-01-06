<script lang="ts">
import UserBoulderList from '@/components/UserBoulderList.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserProgress from '@/components/UserProgress.vue'
import type { User } from '@/types/user'
import axios from 'axios'
import { defineComponent, watch } from 'vue'

export default defineComponent({
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
      user: {} as User,
      bouldersByDifficulty: {} as { [key: number]: number },
    }
  },
  mounted() {
    this.fetchUser()
    watch(() => this.$route, this.fetchUser)
    watch(() => this.qntBoulders, this.fetchUser)
  },
  methods: {
    async fetchUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser) as User
        try {
          const response = await axios.get(`${this.url}/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
              userId: user.id,
            },
          })
          this.user = response.data
          localStorage.setItem('user', JSON.stringify(response.data))
        } finally {
        }
      }
    },
    handleQntboulders(len: number) {
      this.qntBoulders = len
    },
    handleBouldersByDifficulty(difficulties: { [key: number]: number }) {
      this.bouldersByDifficulty = difficulties
    },
  },
  components: {
    UserInfo,
    UserProgress,
    UserBoulderList,
  },
})
</script>

<template>
  <UserProgress :len="qntBoulders" :user="user" />
  <div class="userInfo">
    <UserInfo :bouldersByDifficulty="bouldersByDifficulty" />
    <UserBoulderList
      :url="url"
      @qntBoulders="handleQntboulders"
      @bouldersByDifficulty="handleBouldersByDifficulty"
    />
  </div>
</template>

<style scoped>
.userInfo {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

@media (max-width: 768px) {
  .userInfo {
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
  }
}
</style>
