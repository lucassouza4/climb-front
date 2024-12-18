<script lang="ts">
import axios from 'axios'
import type { Boulder } from '@/types/boulder'
import type { User } from '@/types/user'

export default {
  name: 'BoulderList',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      boulders: [] as Boulder[],
      loading: true,
      error: null as string | null,
      selectedBoulder: null as Boulder | null,
      isModalVisible: false,
    }
  },
  methods: {
    async fetchBoulders() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser) as User
        try {
          const response = await axios.get(`${this.url}/ascents`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
              userId: user.id,
            },
          })
          this.boulders = response.data.boulders
        } catch (err) {
          if (axios.isAxiosError(err)) {
            this.error = err.response?.data?.message || 'An error occurred while fetching boulders.'
          } else {
            this.error = 'An unexpected error occurred.'
          }
        } finally {
          this.loading = false
        }
      }
    },

    async remover() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser) as User
        try {
          await axios.delete(`${this.url}/ascents`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            params: {
              userId: user.id,
              boulderId: this.selectedBoulder?.id,
            },
          })
          this.boulders = this.boulders.filter((boulder) => boulder.id != this.selectedBoulder?.id)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            this.error = err.response?.data?.message || 'An error occurred while fetching boulders.'
          } else {
            this.error = 'An unexpected error occurred.'
          }
        } finally {
          this.$emit('qntBoulders', this.boulders.length)
          this.isModalVisible = false
        }
      }
    },

    showModal(boulder: Boulder) {
      this.selectedBoulder = boulder
      this.isModalVisible = true
    },

    hideModal() {
      this.isModalVisible = false
    },
  },
  async mounted() {
    await this.fetchBoulders()
    this.$emit('qntBoulders', this.boulders.length)
  },
}
</script>

<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Boulders</h1>
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
          <p class="text-muted">Carregando boulders...</p>
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
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="boulder in boulders" :key="boulder.id">
                <td>{{ boulder.name }}</td>
                <td>{{ boulder.city }}</td>
                <td>{{ boulder.sector }}</td>
                <td>V{{ boulder.difficulty }}</td>
                <td>
                  <button type="button" class="btn btn-outline-danger" @click="showModal(boulder)">
                    Remover
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
            <h5 class="modal-title" id="boulderModalLabel">Detalhes do Boulder</h5>
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
            <button type="button" class="btn btn-danger" @click="remover">Remover</button>
            <button type="button" class="btn btn-secondary" @click="hideModal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
