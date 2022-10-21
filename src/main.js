import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"


import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
import "bootstrap/dist/js/bootstrap.min"


/*import './assets/main.css'*/

console.log('< Olá Dev />, seja bem vindo ;)')

const app = createApp(App)

app.use(router)
app.use(createPinia())


app.mount('#app')
