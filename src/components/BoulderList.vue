<template>
    <div class="container-fluid bg-light py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <h1 class="h3 mb-4">Boulder Rank</h1>
          <nav class="navbar navbar-light bg-light">
            <form class="form-inline">
              <input class="form-control mr-sm-2" type="search" placeholder="Buscar boulder" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0 btn-lg" type="submit">Buscar</button>
            </form>
          </nav>
          <div v-if="loading" class="text-center py-4">
            <p class="text-muted">Loading boulders...</p>
          </div>
          <div v-else-if="error" class="text-center py-4">
            <p class="text-danger">{{ error }}</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">City</th>
                  <th scope="col">Sector</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Ascents</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="boulder in boulders" :key="boulder.id">
                  <td>{{ boulder.name }}</td>
                  <td>{{ boulder.city }}</td>
                  <td>{{ boulder.sector }}</td>
                  <td>V{{ boulder.difficulty }}</td>
                  <td>{{ boulder.ascents }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import 'bootstrap/dist/css/bootstrap.min.css'
  import 'bootstrap'
  
  const boulders = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  const fetchBoulders = async () => {
    try {
      const response = await fetch('http://localhost:8000/boulders/')
      if (!response.ok) {
        throw new Error('Failed to fetch boulders')
      }
      const data = await response.json()
      boulders.value = data.boulders
      loading.value = false
    } catch (err) {
      error.value = err.message
      loading.value = false
    }
  }
  
  onMounted(() => {
    fetchBoulders()
  })
  </script>
  
  <style scoped>
  .table th, .table td {
    padding: 0.5rem;
  }
  .form-inline{
    display: flex;
    width: 100%;
  }
  .form-control{
    margin-right: 50px;
  }
  </style>