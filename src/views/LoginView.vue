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
    return {
      signUpSuccess: null as { success: boolean; message: string; redirect: boolean } | null,
    }
  },
  methods: {
    handleSuccess(data: { success: boolean; message: string; redirect: boolean }) {
      this.signUpSuccess = data
      if (this.signUpSuccess.success && this.signUpSuccess.redirect)
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
    },
  },
  components: {
    LogIn,
    SignUp,
  },
}
</script>

<template>
  <div v-if="signUpSuccess?.success === true" class="alert alert-success" role="alert">
    {{ signUpSuccess.message }}
  </div>
  <div v-if="signUpSuccess?.success === false" class="alert alert-danger" role="alert">
    {{ signUpSuccess.message }}
  </div>
  <div class="login-form">
    <LogIn :url="url" @success="handleSuccess" />
    <SignUp :url="url" @success="handleSuccess" />
  </div>
</template>

<style scoped>
.login-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  margin: 2rem;
}

@media (max-width: 768px) {
  .login-form {
    padding: 1rem;
  }

  .login-form > * {
    flex: 1 1 100%;
  }
}

.alert {
  margin: 1rem;
  width: 100%;
}

@media (max-width: 768px) {
  .alert {
    padding: 1rem;
    font-size: 0.9rem;
  }
}
</style>
