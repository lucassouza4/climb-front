<template>
  <div
    v-if="isVisible"
    class="modal fade show d-block"
    tabindex="-1"
    aria-labelledby="boulderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="boulderModalLabel">Detalhes do Boulder</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p><strong>Nome:</strong> {{ boulder?.name }}</p>
          <p><strong>Cidade:</strong> {{ boulder?.city }}</p>
          <p><strong>Setor:</strong> {{ boulder?.sector }}</p>
          <p><strong>Dificuldade:</strong> V{{ boulder?.difficulty }}</p>
          <p><strong>Ascensões:</strong> {{ boulder?.ascents }}</p>
        </div>
        <div class="modal-footer">
          <button v-if="user" type="button" class="btn btn-primary" @click="addAscent">
            Adicionar
          </button>
          <button type="button" class="btn btn-secondary" @click="close">Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { Boulder } from '@/types/boulder'
import type { User } from '@/types/user'
import axios from 'axios'

export default defineComponent({
  name: 'BoulderModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    boulder: {
      type: Object as () => Boulder | null,
      required: false,
      default: null,
    },
    user: {
      type: Object as () => User | null,
      required: false,
      default: null,
    },
    url: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'success'],
  methods: {
    close() {
      this.$emit('close')
    },
    async addAscent() {
      if (!this.boulder || !this.user) return

      const data = {
        userId: this.user.id,
        boulderId: this.boulder.id,
      }

      try {
        await axios.post(`${this.url}/ascents/create`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        this.$emit('success', {
          success: true,
          message: 'Boulder adicionado com sucesso!',
        })
      } catch {
        this.$emit('success', {
          success: false,
          message: 'Boulder já adicionado.',
        })
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
</style>
