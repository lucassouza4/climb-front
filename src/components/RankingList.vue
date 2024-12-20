<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">Ranking</h1>
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
              :class="{ active: activeTab === 'geral' }"
              @click="setActiveTab('geral')"
            >
              Geral
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'boulder' }"
              @click="setActiveTab('boulder')"
            >
              Boulder
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'via' }"
              @click="setActiveTab('via')"
            >
              Via
            </a>
          </li>
        </ul>

        <!-- Tab Content -->
        <div v-if="activeTab === 'geral'">
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
                  <th scope="col">Posição</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Pontuação</th>
                  <th class="texto-acao" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(climber, index) in searchClimbers" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>{{ climber.name }}</td>
                  <td>{{ climber.score }}</td>
                  <td class="botao-acao">
                    <button
                      type="button"
                      class="table-button btn btn-outline-info"
                      @click="verPerfil(climber)"
                    >
                      Perfil
                    </button>
                    <button
                      type="button"
                      class="table-button btn btn-outline-success"
                      @click="verPerfil(climber)"
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'boulder'">
          <p class="text-muted text-center mt-4">Ranking de boulders em construção.</p>
        </div>

        <div v-if="activeTab === 'via'">
          <p class="text-muted text-center mt-4">Ranking de vias em construção.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import type { Ranking } from '@/types/ranking'
import axios from 'axios'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RankingList',
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: '',
      error: '',
      activeTab: 'geral',
      loading: true,
      ranking: [] as Ranking[],
    }
  },
  computed: {
    searchClimbers() {
      return this.ranking.filter((user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
  },
  methods: {
    async fetchRank() {
      try {
        const rank = await axios.get(`${this.url}/ranking`, {
          headers: { Authorization: localStorage.getItem('token') },
        })
        this.ranking = rank.data.ranking
        this.loading = false
      } catch {
        this.error = 'Erro ao buscar o ranking'
      }
    },
    async setActiveTab(tab: string) {
      this.activeTab = tab
    },
    verPerfil(climber: Ranking) {},
  },
  async mounted() {
    await this.fetchRank()
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
.table-button {
  margin-inline: 10px;
}
</style>
