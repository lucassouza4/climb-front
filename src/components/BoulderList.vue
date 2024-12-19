<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Boulders</h1>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline" @submit.prevent="searchBoulders">
            <div class="input-group">
              <input
                v-model="searchQuery"
                class="form-control mr-sm-2"
                type="search"
                placeholder="Buscar boulder"
                aria-label="Text input with dropdown button"
              />
              <div class="input-group-append">
                <button
                  id="dropdown-toggle"
                  class="btn btn-outline-success my-2 my-sm-0 btn-lg dropdown-toggle"
                  type="button"
                >
                  Filtro
                </button>
                <div id="dropdown-menu" class="dropdown-menu">
                  <a class="dropdown-item" href="#" @click="selectItem('Nome')">Nome</a>
                  <a class="dropdown-item" href="#" @click="selectItem('Cidade')">Cidade</a>
                  <a class="dropdown-item" href="#" @click="selectItem('Setor')">Setor</a>
                  <a class="dropdown-item" href="#" @click="selectItem('Dificuldade')"
                    >Dificuldade</a
                  >
                </div>
              </div>
            </div>
          </form>
          <span v-if="selectedFilter" class="texto-filtro" @click="selectItem('')">
            {{ selectedFilter }}
            <span class="bola-x">X</span>
          </span>
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
      selectedBoulder: {} as Boulder,
      user: {} as User,
      loading: true,
      isModalInfoVisible: false,
      isModalEditVisible: false,
      selectedFilter: '',
      searchQuery: '',
      error: '',
    }
  },
  computed: {
    filteredBoulders() {
      switch (this.selectedFilter) {
        case 'Nome':
          return this.boulders.filter((boulder) =>
            boulder.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
        case 'Cidade':
          return this.boulders.filter((boulder) =>
            boulder.city.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
        case 'Setor':
          return this.boulders.filter((boulder) =>
            boulder.sector.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
        case 'Dificuldade':
          return this.boulders.filter(
            (boulder) => boulder.difficulty.toString() === this.searchQuery.slice(1),
          )
        default:
          return this.boulders.filter((boulder) =>
            boulder.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
          )
      }
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
    selectItem(filter: string) {
      this.selectedFilter = filter
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

    // Adicionando controle de dropdown com JavaScript
    const dropdownToggle = document.getElementById('dropdown-toggle')
    const dropdownMenu = document.getElementById('dropdown-menu')

    dropdownToggle?.addEventListener('click', () => {
      dropdownMenu?.classList.toggle('show')
    })

    // Fechar o dropdown ao clicar fora dele
    document.addEventListener('click', (event) => {
      if (
        !dropdownToggle?.contains(event.target as Node) &&
        !dropdownMenu?.contains(event.target as Node)
      ) {
        dropdownMenu?.classList.remove('show')
      }
    })
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
.dropdown-menu {
  display: none;
}
.dropdown-menu.show {
  display: block;
}
.texto-filtro {
  background-color: blue; /* Fundo azul */
  color: white; /* Texto branco */
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
  display: inline-flex;
  margin: 1rem;
  align-items: baseline;
  justify-content: space-around;
}
.texto-filtro:hover {
  cursor: pointer;
}
.bola-x {
  background-color: white; /* Fundo branco para o "x" */
  color: blue; /* Cor do "x" igual ao fundo */
  width: 18px; /* Largura da bola */
  height: 18px; /* Altura da bola */
  border-radius: 50%; /* Forma arredondada */
  display: inline-flex;
  align-items: center; /* Centraliza verticalmente */
  justify-content: center; /* Centraliza horizontalmente */
  font-size: 1rem; /* Tamanho do "x" */
  line-height: 18px; /* Garante o alinhamento vertical perfeito */
  margin-left: 8px;
  cursor: pointer;
}
</style>
