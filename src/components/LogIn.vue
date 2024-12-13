<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h1 class="h3 mb-4">Login</h1>
    <div class="form-group mb-2">
      <label for="exampleInputEmail1">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Enter email"
        v-model="email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
    </div>
    <div class="form-group mb-2">
      <label for="exampleInputPassword1">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <div class="form-check mb-2">
      <input type="checkbox" class="form-check-input" id="exampleCheck1" />
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
  </form>
</template>

<script lang="ts">
export default {
  name: 'LogIn',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return { email: '', password: '' }
  },
  methods: {
    handleSubmit() {
      console.log({ email: this.email, password: this.password })
    },
  },
}
</script>
<style scoped>
.form {
  padding: 2rem;
  max-width: 50%;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 2%;
}
</style>
