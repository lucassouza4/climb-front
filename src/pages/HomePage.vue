<template>
    <BoulderList :url="url"/>
  </template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import BoulderList from '../components/BoulderList.vue';

const boulders = ref([]);
const loading = ref(true);
const error = ref(null);

const props = defineProps(['url']);

const fetchBoulders = async () => {
  try {
    const response = await fetch(`${props.url}/boulders/`);
    if (!response.ok) {
      throw new Error('Failed to fetch boulders');
    }
    const data = await response.json();
    boulders.value = data.boulders;
    loading.value = false;
  } catch (err) {
    error.value = err.message;
    loading.value = false;
  }
};

onMounted(() => {
  fetchBoulders();
});
</script>