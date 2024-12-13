<template>
  <div v-if="signUpSuccess?.success === true" class="alert alert-success" role="alert">
    {{ signUpSuccess.message }}
  </div>
  <div v-if="signUpSuccess?.success === false" class="alert alert-danger" role="alert">
    {{ signUpSuccess.message }}
  </div>
  <div class="login-form">
    <LogIn :url="url" />
    <SignUp :url="url" @success="handleSignUpSuccess" />
  </div>
</template>

<script lang="ts">
import LogIn from '@/components/LogIn.vue'
import SignUp from '@/components/signUp.vue'

export default {
  name: 'loginView',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return { signUpSuccess: null as { success: boolean; message: string } | null }
  },
  methods: {
    handleSignUpSuccess(data: { success: boolean; message: string }) {
      this.signUpSuccess = data
    },
  },
  components: {
    LogIn,
    SignUp,
  },
}
</script>

<style scoped>
.login-form {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5rem;
}
</style>
