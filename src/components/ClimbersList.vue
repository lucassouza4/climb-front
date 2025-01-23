<template>
  <div class="container-fluid bg-light py-4">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h1 class="h3 mb-4">{{ title }}</h1>
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
          <li v-for="tab in tabs" v-bind:key="tab.indexOf(tab)" class="nav-item">
            <a class="nav-link" :class="{ active: activeTab === tab }" @click="setActiveTab(tab)">
              {{ tab }}
            </a>
          </li>
        </ul>

        <!-- Tab Content -->
        <div v-if="activeTab === TabProps.USERS">
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
                      v-bind:disabled="canRequest(climber)"
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

        <div v-if="activeTab === TabProps.FRIENDS">
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
                  <th class="texto-acao" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(friend, index) in filteredFriends" :key="index">
                  <td>
                    {{
                      friend.requesterName === user?.name
                        ? friend.addresseeName
                        : friend.requesterName
                    }}
                  </td>
                  <td class="botao-acao">
                    <button
                      type="button"
                      class="table-button btn btn-outline-danger"
                      @click="removeFriendship(friend.id)"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === TabProps.PENDING">
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
                  <th class="texto-acao" scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(friend, index) in filteredFriendRequest" :key="index">
                  <td>
                    {{
                      friend.requesterName === user?.name
                        ? friend.addresseeName
                        : friend.requesterName
                    }}
                  </td>
                  <td class="botao-acao">
                    <button
                      v-bind:disabled="canAcept(friend)"
                      type="button"
                      class="table-button btn btn-outline-success"
                      @click="aceptFriendship(friend.id)"
                    >
                      Aceitar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TabProps } from '@/enums/climbersTab'
import { Status } from '@/enums/friendship'
import { Type } from '@/enums/user'
import type { Friendship } from '@/types/friendship'
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
    title: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array as () => TabProps[],
      required: true,
    },
    user: {
      type: Object as () => User | null,
      required: true,
    },
  },
  data() {
    return {
      climbers: [] as User[],
      friendship: [] as Friendship[],
      searchQuery: '',
      selectedFilter: '',
      error: '',
      activeTab: this.getActive(),
      loading: true,
    }
  },
  computed: {
    TabProps() {
      return TabProps
    },
    filteredClimbers() {
      return this.climbers.filter((climber) =>
        climber.name.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
    filteredFriends() {
      return this.friendship.filter(
        (friend) =>
          friend.addresseeName.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          friend.status === Status.ACCEPTED,
      )
    },
    filteredFriendRequest() {
      return this.friendship.filter(
        (friend) =>
          friend.addresseeName.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
          friend.status === Status.PENDING,
      )
    },
  },
  methods: {
    canAcept(friend: Friendship) {
      if (friend.addresseeName === this.user?.name) {
        return false
      }
      return true
    },
    canRequest(climber: User) {
      if (climber.id === this.user?.id) {
        return true
      }
      return this.friendship.some(
        (friend) => friend.addresseeName === climber.name || friend.requesterName === climber.name,
      )
    },
    getActive() {
      return this.tabs[0]
    },
    async fetch() {
      if (this.tabs.includes(TabProps.USERS)) await this.fetchUsers()
      await this.fetchFriends()
    },
    async fetchUsers() {
      try {
        const response = await axios.get(`${this.url}/user`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        this.climbers = response.data.users
      } catch {
        this.error = 'An error occurred while fetching boulders.'
      } finally {
        this.loading = false
      }
    },
    async fetchFriends() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser) as User

        try {
          const response = await axios.get(`${this.url}/friendships`, {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
            params: {
              userId: user.id,
            },
          })
          this.friendship = response.data.friendships
        } catch {
          this.error = 'An error occurred while fetching boulders.'
        } finally {
          this.loading = false
        }
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
    async addClimber(climber: User) {
      const data = {
        requesterId: this.user?.id,
        addresseeId: climber.id,
      }
      try {
        const response = await axios.post(`${this.url}/friendship/create`, data, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        })
        this.friendship.push(response.data.friendships[0])
        this.$emit('success', {
          success: true,
          message: 'Pedido de amizade enviado com sucesso!',
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data })
        }
      } finally {
        this.loading = false
      }
    },
    async removeFriendship(id: string) {
      try {
        await axios.delete(`${this.url}/friendships`, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
          params: {
            friendshipId: id,
          },
        })
        const updatedFriendship = this.friendship.filter((friend) => friend.id != id)
        this.friendship = updatedFriendship
        this.$emit('success', {
          success: true,
          message: 'Amizade removida com sucesso!',
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data })
        }
      } finally {
        this.loading = false
      }
    },
    async aceptFriendship(id: string) {
      const data = {
        status: Status.ACCEPTED,
      }
      try {
        await axios.patch(`${this.url}/friendships`, data, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
          params: {
            friendshipId: id,
          },
        })
        const updatedFriendship = this.friendship.map((friend) =>
          friend.id === id ? { ...friend, status: Status.ACCEPTED } : friend,
        )
        this.friendship = updatedFriendship
        this.$emit('success', {
          success: true,
          message: 'Pedido de amizade aceito com sucesso!',
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data })
        }
      } finally {
        this.loading = false
      }
    },
    searchClimbers() {
      //logica da busca
    },
    setActiveTab(tab: TabProps) {
      this.activeTab = tab
    },
  },
  async mounted() {
    await this.fetch()
    this.getActive()
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

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}
</style>
