<script lang="ts">
import ClimbersList from '@/components/ClimbersList.vue'
import { TabProps } from '@/enums/climbersTab'
import type { User } from '@/types/user'

export default {
  name: 'ClimbersView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return { climbersTabs: [TabProps.USERS, TabProps.FRIENDS, TabProps.PENDING] }
  },
  methods: {
    getUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        return JSON.parse(storedUser) as User
      }
      return null
    },
  },
  components: {
    ClimbersList,
  },
}
</script>

<template>
  <div>
    <ClimbersList :url="url" title="Escaladores" :tabs="climbersTabs" :user="getUser()" />
  </div>
</template>

<style scoped></style>
