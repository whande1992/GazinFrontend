<template>
  <button class="btn btn-outline-secondary" type="button" v-on:click="createLevel()">Novo</button>
</template>


<script setup>

import {useDeveloperStore} from '../../store/developers.js'
import {useLevelStore} from '../../store/levels.js'
import api from '../../services/api'
import createLevel from './actionLevels.js'

const developerStore = useDeveloperStore()
const levelStore = useLevelStore()

function getLevels() {
  api.get('levels?per_page=10000').then(res => {
    console.log(res)
    levelStore.levels = res.data.data
  })
}

</script>