<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between align-items-center">Desenvolvedores
        <RouterLink to="/developers/create"><a class="btn btn-primary btn-sm card-title " href="#">Novo</a></RouterLink>
      </h5>
      <p class="card-text">Confira os desenvolvedores cadastrados, atualize, exclua ou adicione um novo</p>

      <div class="row g-2 p-2">
        <div class="col-md">
          <div class="form-floating">
            <input id="floatingInputGrid" v-model="this.developerStore.search.name" class="form-control"
                   placeholder="Ada Lovelace"
                   type="text" v-on:keyup="this.searchDevelopers()">
            <label aria-label="Ada Lovelace" for="floatingInputGrid">Pesquise pelo nome</label>
          </div>
        </div>
        <div class="col-md">
          <div class="form-floating">
            <select id="floatingSelectGrid" v-model="this.developerStore.search.level_id"
                    aria-label="Floating label select example"
                    class="form-select" v-on:change="this.searchDevelopers()">
              <option value="">Todos os níveis</option>
              <template v-for="level in levelStore.levels">
                <option v-if="level.id === developerStore.search.nivel_id" :value=" level.id " selected>
                  {{ level.level }}
                </option>
                <option v-else :value=" level.id ">{{ level.level }}</option>
              </template>

            </select>
            <label for="floatingSelectGrid">Selecione um Nível</label>
          </div>
        </div>
      </div>

      <div class="bd-example table-responsive">
        <table class="table table-sm table-hover ">
          <caption class="caption-top"> {{ this.developerStore.meta.total }} devs
          </caption>
          <thead>
          <tr>
            <th scope="col" v-on:click="fetchDevelopersOrderBy('id')"><a href="#"> <i class="bi bi-chevron-expand"></i></a>
            </th>
            <th scope="col" v-on:click="fetchDevelopersOrderBy('name')"><a href="#">Nome <i
                class="bi bi-chevron-expand"></i></a></th>
            <th colspan="1" v-on:click="fetchDevelopersOrderBy('level_id')"><a href="#"> Nível<i
                class="bi bi-chevron-expand"></i></a></th>
            <th scope="col" v-on:click="fetchDevelopersOrderBy('age')"><a href="#">Idade <i
                class="bi bi-chevron-expand"></i></a></th>
            <th scope="col" v-on:click="fetchDevelopersOrderBy('birth_date')"><a href="#"> Data de nascimento <i
                class="bi bi-chevron-expand"></i></a></th>
            <th scope="col"><i class="bi bi-chevron-expand"></i></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="dev in this.developerStore.devs" style="cursor: context-menu"
              v-on:dblclick="optionActiondeveloper(dev.id)">
            <th scope="row">{{ dev.id }}</th>
            <td>{{ dev.name }}</td>
            <td><span :class="'bg_'+dev.level.id.toString().substr(0, 1)" class="badge ">{{ dev.level.level }}</span>
            </td>
            <td>{{ dev.age }}</td>
            <td>{{ new Date(dev.birth_date).toLocaleDateString() }}</td>
            <td>
              <button :data-bs-content=" dev.hobby " class="btn btn- btn-sm  btn-outline-dark me-2"
                      data-bs-container="body"
                      data-bs-placement="left" data-bs-toggle="popover" title="Hey, ó meu Hobby"
                      type="button">
                <i class="bi bi-info-circle-fill"></i>
              </button>
            </td>
          </tr>

          </tbody>

        </table>

        <nav aria-label="...">
          <ul class="pagination">
            <template v-for="link in this.developerStore.meta.links">

              <li v-if="link.url" :class="{active : link.active}" aria-current="page" class="page-item ">
                <a class="page-link" v-on:click="this.fetchDevelopers(link.url)">{{ link.label }}</a>
              </li>

              <li v-else class="page-item disabled  ">
                <a aria-disabled="true" class="page-link" tabindex="-1"
                   v-on:click="this.fetchDevelopers(link.url)">{{ link.label }}</a>
              </li>
            </template>

          </ul>
        </nav>

      </div>

    </div>
  </div>
</template>

<script>

import router from '../../router'
import {useDeveloperStore} from '../../store/developers.js'
import {useLevelStore} from '../../store/levels.js'
import {onMounted, onUpdated} from 'vue'
import Swal from 'sweetalert2'
import {Popover} from 'bootstrap/dist/js/bootstrap.esm.min.js'


export default {

  setup() {

    const developerStore = useDeveloperStore()
    const levelStore = useLevelStore()


    function fetchDevelopers(link) {
      developerStore.fetchDevelopers(link)
    }

    function fetchDevelopersOrderBy(column) {
      console.log(`Ordenar por ${column}`)
      developerStore.configPagination.order_by_column = column
      developerStore.setDirection()
      developerStore.searchDevelopers()
    }

    function searchDevelopers() {
      developerStore.searchDevelopers()
    }

    function fetchDevelopersById(id) {
      developerStore.fetchDevelopersById(id)
    }

    function optionActiondeveloper(developer_id) {
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
            resolve(developerStore.deleteDeveloper(developer_id))
          }).then(res => {

            levelStore.fetchLevels()
            if (res.status === 204) {
              showMessage('Sucesso!!', 'Developer foi excluído', 'success')
            } else {
              showMessage('Ops!!', res.statusText, 'error')
            }
          })
        } else if (result.isDenied) {
          /*Editar um dev*/
          new Promise((resolve, reject) => {
            resolve(developerStore.fetchDevelopersById(developer_id))
          }).then(res => {
            console.log(res)
            if (res.status) {
              router.push('developers/create')
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

    function instancePopover() {
      Array.from(document.querySelectorAll('button[data-bs-toggle="popover"]'))
          .forEach(popoverNode => new Popover(popoverNode))
    }

    function getRandomColor(id) {
      return 'bg_' + id.toString().substr(0, 1)
    }

    onMounted(() => {
      instancePopover()
      levelStore.fetchLevels(0)
    })

    onUpdated(() => {
      instancePopover()
    })

    return {
      developerStore,
      levelStore,
      fetchDevelopers,
      fetchDevelopersOrderBy,
      searchDevelopers,
      getRandomColor,
      optionActiondeveloper
    }
  },
}

</script>

<style scoped>

.bg_2 {
  background-color: #198754;
}

.bg_1 {
  background-color: #6610f2;
}

.bg_3 {
  background-color: #ffc107;
}

.bg_4 {
  background-color: #d63384;
}

.bg_5 {
  background-color: #0d6efd;
}

.bg_6 {
  background-color: #fd7e14;
}

.bg_7 {
  background-color: #6f42c1;
}

.bg_7 {
  background-color: #20c997;
}

.bg_8 {
  background-color: #0dcaf0;
}

.bg_9 {
  background-color: blueviolet;
}

</style>
