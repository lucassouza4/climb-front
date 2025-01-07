<template>
  <div
    v-if="isVisible"
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="boulderModalLabel"
    :aria-hidden="!isVisible"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="boulderModalLabel">Adicionar Boulder</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="campo">
            <p class="texto-campo"><strong>Nome:</strong></p>
            <input
              v-model="boulderInfo.name"
              type="text"
              class="input-box form-control"
              placeholder="Nome do boulder"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Cidade:</strong></p>
            <input
              v-model="boulderInfo.city"
              type="text"
              class="input-box form-control"
              placeholder="Nome da cidade"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Setor:</strong></p>
            <input
              v-model="boulderInfo.sector"
              type="text"
              class="input-box form-control"
              placeholder="Nome do setor"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Dificuldade:</strong></p>
            <input
              v-model="boulderInfo.difficulty"
              type="text"
              class="input-box form-control"
              placeholder="V0"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button
            v-if="user"
            type="button"
            class="btn btn-warning"
            v-bind:disabled="canChange"
            @click="addBoulder"
          >
            Adicionar
          </button>
          <button type="button" class="btn btn-light" @click="close">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { User } from '@/types/user'
import axios from 'axios'

export default defineComponent({
  name: 'BoulderEditModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object as () => User,
      required: false,
      default: null,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      boulderInfo: { name: '', city: '', sector: '', difficulty: '' },
    }
  },
  computed: {
    canChange() {
      if (
        this.boulderInfo.name != '' ||
        this.boulderInfo.city != '' ||
        this.boulderInfo.sector != '' ||
        this.boulderInfo.difficulty != ''
      )
        return false
      return true
    },
  },
  emits: ['close', 'success'],
  methods: {
    close() {
      this.$emit('close')
    },
    async addBoulder() {
      const data = {
        name: this.boulderInfo.name,
        city: this.boulderInfo.city,
        sector: this.boulderInfo.sector,
        difficulty: Number.parseInt(this.boulderInfo.difficulty.slice(1)),
      }
      try {
        const createdBoulder = await axios.post(`${this.url}/boulders/create`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        this.$emit('success', {
          success: true,
          message: 'Boulder criado com sucesso!',
          boulder: createdBoulder.data,
        })
      } catch (error) {
        if (axios.isAxiosError(error)) {
          this.$emit('success', { success: false, message: error.response?.data })
        }
      } finally {
        this.close()
      }
    },
  },
})
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.campo {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.input-box {
  display: flex;
  width: 100%;
}
.texto-campo {
  display: flex;
  width: 30%;
}
</style>
