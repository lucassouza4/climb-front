<template>
  <NavBar :user="user" />
  <HomePage :url="API_URL"/>
</template>

<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
const API_URL = import.meta.env.VITE_API_URL;

import HomePage from './pages/HomePage.vue';
import { ref, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';

const user = ref(null);

const fetchUser = async () => {
  try {
    const response = await fetch(`${API_URL}/users/?email=4iTrinta@gmail.com`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    user.value = data;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(() => {
  fetchUser();
});
</script>

