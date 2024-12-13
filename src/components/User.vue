<template>
    <div class="container-fluid bg-light py-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <h1 class="h3 mb-4">User List</h1>
          <nav class="navbar navbar-light bg-light">
            <form class="form-inline">
              <input class="form-control mr-sm-2" type="search" placeholder="Buscar boulder" aria-label="Search">
              <button class="btn btn-outline-success my-2 my-sm-0 btn-lg" type="submit">Buscar</button>
            </form>
          </nav>
          <div v-if="loading" class="text-center py-4">
            <p class="text-muted">Loading users...</p>
          </div>
          <div v-else-if="error" class="text-center py-4">
            <p class="text-danger">{{ error }}</p>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
import { ref, onMounted } from 'vue'

const users = ref([])
const loading = ref(true)
const error = ref(null)

const props = defineProps(['url'])

const fetchUsers = async () => {
    try {
        const response = await fetch(`${props.url}/users/?email=4iTrinta@gmail.com`)
        if(!response.ok){
            throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        console.log(data)
        users.value = data.users
        loading.value = false
    } catch (err) {
        console.log(err)
        error.value = err.message
        loading.value = false
    }
}
onMounted(() =>{
    fetchUsers()
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