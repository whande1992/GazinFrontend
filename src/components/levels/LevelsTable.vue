<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between align-items-center">Níveis
        <a class="btn btn-primary btn-sm card-title " href="#" v-on:click="createNewLevel()">Novo</a>
      </h5>
      <p class="card-text">Confira os níveis cadastrados, atualize, exclua ou adicione um novo</p>
      <div class="bd-example">
        <table class="table table-sm">
          <caption>{{ levelStore.meta.total }} Níveis</caption>
          <thead>
          <tr>
            <th scope="row">#</th>
            <th scope="col">Nível</th>
            <th scope="col">Desenvolvedores</th>

          </tr>
          </thead>
          <tbody>
          <template v-for="level in levelStore.levels">
            <tr v-on:dblclick="optionActiondeveloper(level.id)">
              <th scope="row">{{ level.id }}</th>
              <td> {{ level.level }}</td>
              <td> {{ level.total_developers }}</td>
            </tr>
          </template>
          </tbody>

        </table>

        <nav aria-label="...">
          <ul class="pagination">
            <template v-for="link in this.levelStore.meta.links">

              <li v-if="link.url" :class="{active : link.active}" aria-current="page" class="page-item ">
                <a class="page-link" v-on:click="this.getLevels(link.url)">{{ link.label }}</a>
              </li>

              <li v-else class="page-item disabled  ">
                <a aria-disabled="true" class="page-link" tabindex="-1"
                   v-on:click="this.getLevels(link.url)">{{ link.label }}</a>
              </li>
            </template>

          </ul>
        </nav>
      </div>

    </div>
  </div>
</template>

<script setup>
import {useDeveloperStore} from '../../store/developers.js'
import {useLevelStore} from '../../store/levels.js'
import {onUnmounted} from 'vue'
import Swal from 'sweetalert2'
import createLevel from '../levels/actionLevels.js'

const developerStore = useDeveloperStore()
const levelStore = useLevelStore()


function getLevels(url) {
  levelStore.getLevels(url)
}

function createNewLevel() {
  levelStore.reset()
  createLevel()
}

function optionActiondeveloper(level_id) {
  Swal.fire({
    title: 'Qual ação você deseja ?',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,

    cancelButtonText: 'Cancelar',
    denyButtonText: `Editar`,
    confirmButtonText: 'Excluir',

    customClass: {
      cancelButton: 'btn btn-danger m-2',
      confirmButton: 'btn btn-dark m-2',
      denyButton: 'btn btn-primary m-2',
    },
    buttonsStyling: false

  }).then((result) => {
    if (result.isConfirmed) {
      /*Excluir um DEV*/
      new Promise((resolve, reject) => {
        resolve(levelStore.deleteLevel(level_id))
      }).then(res => {

        levelStore.fetchLevels()
        if (res.status === 204) {
          showMessage('Sucesso!!', 'Nível foi excluído', 'success')
        } else {
          showMessage('Ops!!', res.statusText, 'error')
        }
      })
    } else if (result.isDenied) {
      /*Editar um dev*/
      new Promise((resolve, reject) => {
        console.log("o id e " + level_id)
        resolve(levelStore.fetchLevelById(level_id))
      }).then(res => {

        console.log(res)
        if (res.status) {
          createLevel()
        } else {
          showMessage('Ops!!', res.message, 'error')
        }

      })
    }
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

onUnmounted(() => {
  levelStore.fetchLevels()
})

</script>

<style scoped>

</style>
