<template>
  <form class="form" @submit.prevent="handleSubmit">
    <h1 class="h3 mb-4">SignUp</h1>
    <div class="form-group mb-2">
      <label for="exampleInputName2">Name</label>
      <input
        type="text"
        class="form-control"
        id="exampleInputName2"
        placeholder="Enter name"
        v-model="name"
      />
    </div>
    <div class="form-group mb-2">
      <label for="exampleInputEmail2">Email address</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail2"
        aria-describedby="emailHelp"
        placeholder="Enter email"
        v-model="email"
      />
    </div>
    <div class="form-group mb-2">
      <label for="exampleInputPassword2">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword2"
        placeholder="Password"
        v-model="password"
      />
    </div>
    <div class="form-check mb-2">
      <input type="checkbox" class="form-check-input" id="exampleCheck2" />
      <label class="form-check-label" for="exampleCheck2">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script lang="ts">
import type { User } from '@/types/user'
import axios from 'axios'

export default {
  name: 'SignUp',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return { name: '', email: '', password: '' }
  },
  methods: {
    async handleSubmit() {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
      }
      try {
        const response = await axios.post(`${this.url}/users/create`, data)
        const user: User = {
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
        }

        this.SaveToSession(user)

        this.$emit('success', {
          success: true,
          message: 'Usuário criado com sucesso !',
          redirect: false,
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data, redirect: false })
        }
      }
    },

    SaveToSession(user: User) {
      sessionStorage.setItem('user', JSON.stringify(user))
    },
  },
}
</script>
<style scoped>
.form {
  padding: 2rem;
  width: 50%;
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  flex-direction: column;
  align-content: center;
  box-shadow: 0px 5px 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 2%;
}
</style>
