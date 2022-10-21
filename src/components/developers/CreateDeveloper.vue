<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between align-items-center">
        <span
            v-if="developerStore.developer.id">{{ developerStore.developer.name }}  ({{ developerStore.developer.age }} anos)</span>
        <span v-else>Cadastro de Desenvolvedor</span>
        <RouterLink to="/developers"><a class="btn btn-primary btn-sm card-title " href="#">Voltar</a>
        </RouterLink>
      </h5>
      <p v-if="developerStore.developer.id" class="card-text">Edite as informações necessárias</p>
      <p v-else class="card-text">Prencha com as informações do novo desenvolvedor</p>

      <form class="row g-3 p-4">
        <div class="col-md-6 ">
          <label class="form-label" for="name">Nome</label>
          <input id="name" v-model="developerStore.developer.name" :class="{'is-invalid' : stateLocalDeveloper.error.name    }"
                 aria-describedby="validationNameFeedback" class="form-control "
                 max="70" maxlength="70" min="3" placeholder="Ada Lovelace" required
                 type="text">
          <div v-for="error in stateLocalDeveloper.error.name" id="validationNameFeedback" class="invalid-feedback">
            {{ error }}
          </div>
        </div>
        <div class="col-md-6">
          <label class="form-label" for="birth_date">Data de Nascimento</label>
          <input id="birth_date" v-model="developerStore.developer.birth_date" :class="{'is-invalid' : stateLocalDeveloper.error.birth_date}"
                 aria-describedby="validationBirthDateFeedback" class="form-control" required
                 type="date">
          <div v-for="error in stateLocalDeveloper.error.birth_date" id="validationBirthDateFeedback"
               class="invalid-feedback">
            {{ error }}
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <select id="level_id" v-model="developerStore.developer.level_id" :class="{'is-invalid' : stateLocalDeveloper.error.level_id    }"
                    aria-describedby="validationLevelIdDateFeedback" aria-label="Selecione um Nível"
                    class="form-select form-control" required>
              <option disabled value="">Selecione um nível</option>
              <template v-for="level in levelStore.levels">
                <option :value="level.id">{{ level.level }}</option>
              </template>
            </select>
            <FormLevel></FormLevel>
            <div v-for="error in stateLocalDeveloper.error.level_id" id="validationLevelIdDateFeedback"
                 class="invalid-feedback">
              {{ error }}
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <select id="gender" v-model="developerStore.developer.gender" :class="{'is-invalid' : stateLocalDeveloper.error.gender}"
                    aria-describedby="validationGenderFeedback" aria-label="Selecione um genero" class="form-select form-control"
                    required>
              <option disabled value="">Selecione um genero</option>
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
            </select>
            <div v-for="error in stateLocalDeveloper.error.gender" id="validationGenderFeedback"
                 class="invalid-feedback">
              {{ error }}
            </div>
          </div>
        </div>
        <div class="col-12">
          <label class="form-label" for="hobby">Hobby</label>

          <textarea id="hobby" v-model="developerStore.developer.hobby" :class="{'is-invalid' : stateLocalDeveloper.error.hobby}"
                    aria-describedby="validationGenderFeedback" class="form-control"
                    maxlength="120" placeholder="Tem algum hobby maneiro? compartilha com nós ;)"
                    rows="3"></textarea>
          <div v-for="error in stateLocalDeveloper.error.hobby" id="validationHobbyFeedback" class="invalid-feedback">
            {{ error }}
          </div>
        </div>

        <div class="col-12">
          <a v-if="developerStore.developer.id" class="btn btn-primary" type="submit"
             v-on:click="this.updateDeveloper()">Atualizar</a>
          <a v-else class="btn btn-primary" type="submit" v-on:click="this.createDeveloper()">Criar novo</a>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>

import {onMounted, onUnmounted, reactive} from 'vue'
import {useDeveloperStore} from '../../store/developers.js'
import {useLevelStore} from '../../store/levels.js'
import Swal from 'sweetalert2'
import FormLevel from '../levels/FormLevel.vue'


const developerStore = useDeveloperStore()
const levelStore = useLevelStore()
const stateLocalDeveloper = reactive({levels: [], error: {}})

function reset() {
  getLevels()
  stateLocalDeveloper.error = {}
  levelStore.fetchTopLevels()
}

function getLevels() {
  levelStore.fetchLevels(1000)
}

function getDeveloperById(id) {
  developerStore.fetchDevelopersById(id)
}

function createDeveloper() {

  new Promise((resolve, reject) => {
    resolve(developerStore.createDeveloper())
  }).then(res => {

    if (res.status === 201) {
      getDeveloperById(res.data.data.id)
      const title = `Sucesso ;)`;
      const message = `Foi criado um novo cadastro para "${developerStore.developer.name}" .`;
      showMessage(title, message)
      reset()
    } else {
      stateLocalDeveloper.error = res.data
    }
  }).catch(error => {
    stateLocalDeveloper.error = error.response.data
    console.log(error.response)
  })
}

function updateDeveloper() {

  new Promise((resolve, reject) => {
    resolve(developerStore.updateDeveloper())
  }).then(res => {
    if (res.status === 200) {
      const title = `Sucesso ;)`;
      const message = `O cadastro de "${developerStore.developer.name}" foi atualizado .`;
      showMessage(title, message)
      reset()
    } else {
      stateLocalDeveloper.error = res.data
    }
  }).catch(error => {
    console.log(error)
  })
}

function showMessage(title, message, icon = 'success') {
  Swal.fire({
    title: title,
    text: message,
    icon: icon,
    customClass: {
      confirmButton: 'btn btn-success m-2',
    },
    buttonsStyling: false,
  })
}

onMounted(() => {
  getLevels();
})

onUnmounted(() => {
  developerStore.developer.id = '',
      developerStore.developer.name = '',
      developerStore.developer.birth_date = '',
      developerStore.developer.age = '',
      developerStore.developer.gender = '',
      developerStore.developer.level_id = '',
      developerStore.developer.hobby = ' '
})


</script>

<style scoped>

</style>