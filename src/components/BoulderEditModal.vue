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
          <h5 class="modal-title" id="boulderModalLabel">Alterar Boulder</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="campo">
            <p class="texto-campo"><strong>Nome:</strong></p>
            <input
              v-model="changedBoulder.name"
              type="text"
              class="input-box form-control"
              :placeholder="boulder?.name"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Cidade:</strong></p>
            <input
              v-model="changedBoulder.city"
              type="text"
              class="input-box form-control"
              :placeholder="boulder?.city"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Setor:</strong></p>
            <input
              v-model="changedBoulder.sector"
              type="text"
              class="input-box form-control"
              :placeholder="boulder?.sector"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
          <div class="campo">
            <p class="texto-campo"><strong>Dificuldade:</strong></p>
            <input
              v-model="changedBoulder.difficulty"
              type="text"
              class="input-box form-control"
              :placeholder="boulder?.difficulty.toString()"
              aria-label="Nome"
              aria-describedby="basic-addon1"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="user" type="button" class="btn btn-danger" @click="addAscent">
            Excluir
          </button>
          <button
            v-if="user"
            type="button"
            class="btn btn-warning"
            v-bind:disabled="canChange"
            @click="addAscent"
          >
            Alterar
          </button>
          <button type="button" class="btn btn-light" @click="close">Fechar</button>
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
  name: 'BoulderEditModal',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    boulder: {
      type: Object as () => Boulder,
      required: false,
      default: null,
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
      changedBoulder: { name: '', city: '', sector: '', difficulty: '' },
    }
  },
  computed: {
    canChange() {
      if (
        this.changedBoulder.name != '' ||
        this.changedBoulder.city != '' ||
        this.changedBoulder.sector != '' ||
        this.changedBoulder.difficulty != ''
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
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    async addAscent() {
      console.log(this.changedBoulder)
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
