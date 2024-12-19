<template>
  <div class="card">
    <img class="card-img-top" src="../assets/perfil.webp" alt="Card image cap" />
    <div class="card-body">
      <h5 v-if="user" class="card-title">
        {{ user.name }} -
        <span :class="getTypeClass(user.type)">
          {{ getTypeName(user.type) }}
        </span>
      </h5>

      <div>
        <h4>Métricas</h4>
        <div v-for="(bar, index) in progressBars" :key="index">
          <div>V{{ bar.difficulty }} - {{ bar.count }} boulders</div>
          <div>
            <progress :value="bar.percentage" max="100"></progress>
            {{ bar.percentage.toFixed(2) }}%
          </div>
        </div>
      </div>

      <a href="#" class="btn btn-primary">Editar</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Type } from '@/enums/user'
import type { User } from '@/types/user'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'UserInfo',
  props: {
    bouldersByDifficulty: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: reactive({
        id: '',
        name: '',
        email: '',
        score: 0,
        type: 0,
      }) as User,
    }
  },
  mounted() {
    this.getInfo()
  },
  computed: {
    progressBars() {
      return Object.entries(this.bouldersByDifficulty).map(([difficulty, count]) => ({
        difficulty: Number(difficulty),
        count,
        percentage: (count / this.totalBoulders) * 100,
      }))
    },
    totalBoulders() {
      return Object.values(this.bouldersByDifficulty).reduce((sum, count) => sum + count, 0)
    },
  },
  methods: {
    getInfo() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser) as User
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
  },
})
</script>
<style scoped>
.card {
  width: 18rem;
}
.user-type-basic {
  background-color: blue; /* Fundo azul */
  color: white; /* Texto branco */
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
  display: inline-block;
}

.user-type-master {
  background-color: purple; /* Fundo roxo */
  color: white; /* Texto branco */
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: bold;
  display: inline-block;
}
.btn {
  margin-top: 2rem;
}
</style>
