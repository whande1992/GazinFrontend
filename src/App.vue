<script setup>
import {useDeveloperStore} from './store/developers'
import {useLevelStore} from './store/levels.js'
import {onMounted} from 'vue'
import NavBar from './components/NavBar.vue'
import TopLevels from './components/levels/TopLevels.vue'

const developerStore = useDeveloperStore()
const levelStore = useLevelStore()

onMounted(() => {
  developerStore.fetchDevelopers()
  levelStore.fetchLevels()
})


</script>

<template>

  <div class="container-fluid">
    <header>

      <NavBar></NavBar>
    </header>
    <main>
      <div class=" shadow-lg pt-5 pb-5  mb-5 mt-5 bg-body rounded">
        <div class="p-sx-5 p-sm-3">
          <div class="row">
            <div class="col-xs-12 col-sm-10 col-md-9">
              <div class="row">
                <div class="col-12 col-sm-12">
                  <div class="row">
                    <div class="col-sm-12">
                      <RouterView/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xs-12 col-sm-2 col-md-3 pb-3">
              <TopLevels></TopLevels>
            </div>

          </div>
        </div>
      </div>
    </main>
    <footer>

    </footer>

  </div>
</template>

