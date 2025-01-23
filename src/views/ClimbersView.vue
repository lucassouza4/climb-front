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
    return {
      climbersTabs: [TabProps.USERS],
      addFriendshipSuccess: {} as { success: boolean; message: string },
    }
  },
  methods: {
    handleSuccess(data: { success: boolean; message: string }) {
      this.addFriendshipSuccess = data
    },
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
  <div v-if="addFriendshipSuccess?.success === true" class="alert alert-success" role="alert">
    {{ addFriendshipSuccess.message }}
  </div>
  <div v-if="addFriendshipSuccess?.success === false" class="alert alert-danger" role="alert">
    {{ addFriendshipSuccess.message }}
  </div>
  <div>
    <ClimbersList
      :url="url"
      title="Escaladores"
      :tabs="climbersTabs"
      :user="getUser()"
      @success="handleSuccess"
    />
  </div>
</template>

<style scoped></style>
