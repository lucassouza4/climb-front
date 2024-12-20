<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Escaladores</h1>
        <nav class="navbar navbar-light bg-light">
          <form class="form-inline" @submit.prevent="searchClimbers">
            <div class="input-group">
              <input
                v-model="searchQuery"
                class="form-control mr-sm-2"
                type="search"
                placeholder="Buscar escalador"
                aria-label="Buscar escalador"
              />
              <button type="button" class="btn btn-outline-success">Buscar</button>
            </div>
          </form>
        </nav>
        <!-- Nav Tabs -->
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'users' }"
              @click="setActiveTab('users')"
            >
              Usuários
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'friends' }"
              @click="setActiveTab('friends')"
            >
              Amigos
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'pending' }"
              @click="setActiveTab('pending')"
            >
              Pedidos pendentes
            </a>
          </li>
        </ul>

        <!-- Tab Content -->
        <div v-if="activeTab === 'users'">
          <div v-if="loading" class="text-center py-4">
            <p class="text-muted">Carregando escaladores...</p>
          </div>
          <div v-else-if="error" class="text-center py-4">
            <p class="text-danger">{{ error }}</p>
          </div>
          <div v-else class="table-responsive mt-3">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Pontuação</th>
                  <th scope="col">Ranking</th>
                  <th class="texto-acao" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(climber, index) in filteredClimbers" :key="index">
                  <td>{{ climber.name }}</td>
                  <td>
                    <span :class="getTypeClass(climber.type)">
                      {{ getTypeName(climber.type) }}
                    </span>
                  </td>
                  <td>{{ climber.score }}</td>
                  <td>{{ climber.rank }}</td>
                  <td class="botao-acao">
                    <button
                      type="button"
                      class="table-button btn btn-outline-success"
                      @click="addClimber(climber)"
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'friends'">
          <p class="text-muted text-center mt-4">Lista de amigos em construção.</p>
        </div>

        <div v-if="activeTab === 'pending'">
          <p class="text-muted text-center mt-4">Lista de pedidos pendentes em construção.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Type } from '@/enums/user'
import type { User } from '@/types/user'
import axios from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ClimbersList',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      climbers: [] as User[],
      searchQuery: '',
      selectedFilter: '',
      error: '',
      activeTab: 'users',
      loading: true,
    }
  },
  computed: {
    filteredClimbers() {
      return this.climbers.filter((climber) =>
        climber.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${this.url}/user`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        this.climbers = response.data.users
        this.sortedClimbers()
      } catch {
        this.error = 'An error occurred while fetching boulders.'
      } finally {
        this.loading = false
      }
    },
    getTypeName(type: number): string {
      return Type[type]
    },
    getTypeClass(type: Type): string {
      switch (type) {
        case Type.BASIC:
          return 'user-type-basic'
        case Type.MASTER:
          return 'user-type-master'
      }
    },
    sortedClimbers() {
      return this.climbers.sort((a, b) => b.score - a.score)
    },
    addClimber(climber: User) {
      console.log(climber)
    },
    searchClimbers() {
      //logica da busca
    },
    setActiveTab(tab: string) {
      this.activeTab = tab
    },
  },
  async mounted() {
    await this.fetchUsers()
  },
})
</script>

<style scoped>
.form-inline {
  display: flex;
  width: 100%;
}
.texto-acao {
  text-align: center;
}
.botao-acao {
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-tabs .nav-link {
  cursor: pointer;
}
.nav-tabs .nav-link.active {
  font-weight: bold;
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6 #dee2e6 #fff;
}
.user-type-basic {
  background-color: blue; /* Fundo azul */
  color: white; /* Texto branco */
  padding: 4px 12px;
  border-radius: 20px;
  width: 50px;
  font-size: 0.5rem;
  display: flex;
  justify-content: center;
}
.user-type-master {
  background-color: purple; /* Fundo roxo */
  color: white; /* Texto branco */
  padding: 4px 12px;
  width: 50px;
  border-radius: 20px;
  font-size: 0.5rem;
  display: flex;
  justify-content: center;
}
</style>
