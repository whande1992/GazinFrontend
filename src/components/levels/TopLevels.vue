<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title d-flex justify-content-between align-items-center">Top 5 Níveis
          <RouterLink to="/levels"><a class="btn btn-primary btn-sm card-title " href="#">Níveis</a></RouterLink>
        </h5>
        <p class="card-text">Maiores níveis por desenvolvedores</p>

        <ul class="list-group">
          <template v-for="level in levelStore.topLevels">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              {{ level.level }}
              <span class="badge bg-primary rounded-pill">{{ level.total_developers }}</span>
            </li>
          </template>

        </ul>
      </div>
    </div>
    <ol class="list-group list-group-numbered" style="display: none">
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            <RouterLink to="/developers">Desenvolvedores</RouterLink>

          </div>
          Devs cadastrados
        </div>
        <span class="badge bg-primary rounded-pill">{{ developerStore.meta.total }}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-start">
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            <RouterLink to="/levels">Níveis</RouterLink>
          </div>
          Níveis cadastrados
        </div>
        <span class="badge bg-primary rounded-pill">{{ levelStore.meta.total }}</span>
      </li>
    </ol>
  </div>
</template>

<script >

import { useDeveloperStore } from '../../store/developers.js'
import { useLevelStore } from '../../store/levels.js'
import { onMounted } from 'vue'

export default {

  setup() {
    const developerStore = useDeveloperStore()
    const levelStore = useLevelStore()

    function fetchDevelopers(){
      developerStore.fetchDevelopers()
    }

    onMounted(() => {
      levelStore.fetchTopLevels()
    })

    return {
      developerStore,
      levelStore
    }
  },
}


</script>

<style scoped>

</style>

