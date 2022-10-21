import {defineStore} from 'pinia'
import  api from '../services/api.js'

export const useLevelStore = defineStore('levels', {
    state: () => ({
        levels: [],
        topLevels : [],
        levelSelected: {
            id: '',
            level: ''
        },
        links : [],
        meta : [],
        error: {}
    }),

    actions: {
        fetchLevels(per_page= 0) {
            const url = `levels?per_page=${per_page}`;
            this.getLevels(url)
        },

        fetchTopLevels() {
            api.get(`levels?per_page=10000`).then(res=>{
                console.log(res.data.data)
                this.topLevels = res.data.data
                this.links = res.data.links
                this.meta = res.data.meta

                new Promise((resolve, reject) => {
                    resolve(this.sortLevels())
                }).then(res => {
                    this.topLevels = this.topLevels.slice(0, 5);
                })

            })
        },

        getLevels(url) {
             api.get(url).then(res=>{
                console.log(res.data.data)
                this.levels = res.data.data
                this.links = res.data.links
                this.meta = res.data.meta

                this.sortLevels()
            })
        },

        deleteLevel(id) {

            return api.delete(`levels/${id}`).then(res => {
                console.log(res)
                if (res.status === 204) {
                    this.fetchLevels()
                    return {status: 204, statusText: 'Nível excluído com sucesso!'}
                }
            }).catch(error => {
                console.log(error)
                if (error.response.status === 501) {
                    return {status: error.status, statusText: error.response.data.message}
                }else{
                    return {status: error.status, statusText: error.response.statusText}
                }
                console.log('Deleting Level')
                return error.response
            })
        },

        fetchLevelById(id) {
            return api.get(`levels/${id}`).then(res =>{
                if (res.status === 200) {

                    const level = res.data.data
                    this.levelSelected.id = level.id
                    this.levelSelected.level = level.level

                    return res
                }
            }).catch( error => {
                console.log(error)
                console.log('Fetch Level by ID')
                console.log(error.response.data)
                return error.response.data
            })
        },

        reset() {
            this.levelSelected.level =''
            this.levelSelected.id =''
        },




        sortLevels() {
           return this.topLevels.sort((b, a) => a.total_developers - b.total_developers);
        }
    }

} )
