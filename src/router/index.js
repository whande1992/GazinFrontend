import {createRouter, createWebHistory} from 'vue-router'
import DeveloperView from '../views/developers/DeveloperView.vue'
import CreateDeveloperView from '../views/developers/CreateDeveloperView.vue'
import LevelView from '../views/LevelView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        
        {
            path: '',
            name: '',
            component: DeveloperView
        },
        {
            path: '/developers',
            name: 'developers',
            component: DeveloperView
        },
        {
            path: '/developers/create',
            name: 'developersCreate',
            component: CreateDeveloperView
        },
        {
            path: '/levels',
            name: 'levels',
            component: LevelView
        },


    ]
})

export default router
