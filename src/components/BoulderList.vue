<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Boulders</h1>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline" @submit.prevent="searchBoulders">
            <input
              v-model="searchQuery"
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
                <th scope="col">#</th>
                <th scope="col">Nome</th>
                <th scope="col">Cidade</th>
                <th scope="col">Setor</th>
                <th scope="col">Dificuldade</th>
                <th scope="col">Ascensões</th>
                <th class="texto-acao" scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(boulder, index) in filteredBoulders" :key="boulder.id">
                <td>{{ index + 1 }}</td>
                <td>{{ boulder.name }}</td>
                <td>{{ boulder.city }}</td>
                <td>{{ boulder.sector }}</td>
                <td>V{{ boulder.difficulty }}</td>
                <td>{{ boulder.ascents }}</td>
                <td class="botao-acao">
                  <button
                    type="button"
                    class="table-button btn btn-outline-info"
                    @click="showInfoModal(boulder)"
                  >
                    Info
                  </button>
                  <button
                    v-if="hasPermission"
                    type="button"
                    class="table-button btn btn-outline-warning"
                    @click="showEditModal(boulder)"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <BoulderInfoModal
      v-if="isModalInfoVisible"
      :boulder="selectedBoulder"
      :user="user"
      :isVisible="isModalInfoVisible"
      :url="url"
      @close="hideInfoModal"
      @success="handleSuccess"
    />

    <BoulderEditModal
      v-if="isModalEditVisible"
      :boulder="selectedBoulder"
      :user="user"
      :isVisible="isModalEditVisible"
      :url="url"
      @close="hideEditModal"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import BoulderInfoModal from '@/components/BoulderInfoModal.vue'
import type { Boulder } from '@/types/boulder'
import type { User } from '@/types/user'
import { defineComponent } from 'vue'
import { Permissions } from '@/enums/user'
import type { TokenPayload } from '@/types/tokenPayload'
import BoulderEditModal from './BoulderEditModal.vue'

export default defineComponent({
  name: 'BoulderList',
  components: {
    BoulderInfoModal,
    BoulderEditModal,
  },
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      boulders: [] as Boulder[],
      permissions: [] as Permissions[],
      loading: true,
      searchQuery: '',
      error: '',
      selectedBoulder: {} as Boulder,
      isModalInfoVisible: false,
      isModalEditVisible: false,
      user: {} as User,
    }
  },
  computed: {
    filteredBoulders() {
      return this.boulders.filter((boulder) =>
        boulder.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
    hasPermission() {
      return this.permissions.includes(Permissions.UPDATE_BOULDER)
    },
  },
  methods: {
    async fetchBoulders() {
      try {
        const response = await axios.get(`${this.url}/boulders/`)
        this.boulders = response.data.boulders
      } catch {
        this.error = 'An error occurred while fetching boulders.'
      } finally {
        this.loading = false
      }
    },
    sortedBoulders() {
      this.boulders.sort((a, b) => b.ascents - a.ascents)
    },
    showInfoModal(boulder: Boulder) {
      this.selectedBoulder = boulder
      this.isModalInfoVisible = true
    },
    showEditModal(boulder: Boulder) {
      this.selectedBoulder = boulder
      this.isModalEditVisible = true
    },
    hideInfoModal() {
      this.isModalInfoVisible = false
    },
    hideEditModal() {
      this.isModalEditVisible = false
    },
    searchBoulders() {
      // Logic for search can be extended here if needed
    },
    handleSuccess(event: { success: boolean; message: string }) {
      this.$emit('success', event)

      if (event.success) {
        const updatedBoulder = this.boulders.find(
          (boulder) => boulder.id === this.selectedBoulder?.id,
        )
        if (updatedBoulder) {
          updatedBoulder.ascents += 1
          this.sortedBoulders()
        }
      }
    },
    decodeToken(token: string) {
      const decoded = jwtDecode(token) as TokenPayload
      this.permissions = decoded.permissions
    },
  },
  async mounted() {
    await this.fetchBoulders()
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('token')
    if (storedUser) {
      this.user = JSON.parse(storedUser) as User
    }
    if (storedToken) this.decodeToken(storedToken)
  },
})
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
  margin-right: 10px;
}
.table-button {
  margin: 1rem;
}
.texto-acao {
  text-align: center;
}
.botao-acao {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
