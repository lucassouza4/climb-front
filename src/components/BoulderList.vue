<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Boulder Rank</h1>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline">
            <input
              class="form-control mr-sm-2"
              type="search"
              placeholder="Buscar boulder"
              aria-label="Search"
            />
            <button class="btn btn-outline-success my-2 my-sm-0 btn-lg" type="submit">
              Buscar
            </button>
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
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">City</th>
                <th scope="col">Sector</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Ascents</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(boulder, index) in boulders" :key="boulder.id">
                <td>{{ index + 1 }}</td>
                <td>{{ boulder.name }}</td>
                <td>{{ boulder.city }}</td>
                <td>{{ boulder.sector }}</td>
                <td>V{{ boulder.difficulty }}</td>
                <td>{{ boulder.ascents }}</td>
                <td>
                  <button type="button" class="btn btn-outline-info" @click="showModal(boulder)">
                    Info
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalVisible"
      class="modal fade show d-block"
      tabindex="-1"
      aria-labelledby="boulderModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="boulderModalLabel">Boulder Details</h5>
            <button type="button" class="btn-close" @click="hideModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p><strong>Name:</strong> {{ selectedBoulder?.name }}</p>
            <p><strong>City:</strong> {{ selectedBoulder?.city }}</p>
            <p><strong>Sector:</strong> {{ selectedBoulder?.sector }}</p>
            <p><strong>Difficulty:</strong> V{{ selectedBoulder?.difficulty }}</p>
            <p><strong>Ascents:</strong> {{ selectedBoulder?.ascents }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="hideModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Boulder } from '@/types/boulder'

export default {
  name: 'BoulderList',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const boulders = ref<Boulder[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)
    const selectedBoulder = ref<Boulder | null>(null)
    const isModalVisible = ref(false)

    const fetchBoulders = async () => {
      try {
        const response = await axios.get(`${props.url}/boulders/`)
        boulders.value = response.data.boulders
      } catch (err) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data?.message || 'An error occurred while fetching boulders.'
        } else {
          error.value = 'An unexpected error occurred.'
        }
      } finally {
        loading.value = false
      }
    }

    const showModal = (boulder: Boulder) => {
      selectedBoulder.value = boulder
      isModalVisible.value = true
    }

    const hideModal = () => {
      isModalVisible.value = false
    }

    onMounted(fetchBoulders)

    return {
      boulders,
      loading,
      error,
      selectedBoulder,
      isModalVisible,
      showModal,
      hideModal,
    }
  },
}
</script>

<style scoped>
.table th,
.table td {
  padding: 0.5rem;
}
.form-inline {
  display: flex;
  width: 100%;
}
.form-control {
  margin-right: 50px;
}
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
