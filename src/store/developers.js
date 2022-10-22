import {defineStore} from 'pinia'
import api from '../services/api.js'

export const useDeveloperStore = defineStore('developers', {
    state: () => ({
        devs: [],
        links: [],
        meta: [],
        configPagination: {
            per_page: 10,
            order_by_column: '',
            order_by_direction: 'asc',
            page: 1
        },
        search: {
            name: '',
            level_id: ''
        },
        developer : {
            id : '',
            name : '',
            birth_date : '',
            age : '',
            gender: '',
            level_id : '',
            hobby : ' '
        }
    }),

    actions: {
        getDevelopers(url)
        {
            if(url){
                api.get(url).then(res => {
                    console.log(res.data.data)
                    this.devs = res.data.data
                    this.links = res.data.links
                    this.meta = res.data.meta
                })
            }
        },

        fetchDevelopers(link = null) {
            let queryString = {...this.configPagination}
            queryString = new URLSearchParams(queryString).toString();
            let url = link ? link : `developers?${queryString}`

            this.getDevelopers(url)
        },

        searchDevelopers(link) {
             let queryString = {}
             queryString = Object.assign(queryString, this.search)
             queryString =    Object.assign(queryString, this.configPagination)

             queryString = new URLSearchParams(queryString).toString();
             let url = link ? link : `developer/search?${queryString}`

             this.getDevelopers(url)
        },

        setDirection() {
            this.configPagination.order_by_direction = this.configPagination.order_by_direction === 'asc' ? 'desc' :'asc'
        },

        deleteDeveloper(id) {

            return api.delete(`developers/${id}`).then(res => {
                console.log(res)
              if (res.status === 204) {
                  this.fetchDevelopers()
                  return {status: 204, statusText: 'Developer excluido com sucesso!'}
              }else{
                  return {status: res.status, statusText: res.statusText}
              }
          }).catch(error => {
                console.log('Deleting developer')
                console.log(error.response.status)
                return error.response
            })
        },

        createDeveloper() {
            return api.post('developers', this.developer).then(res => {
                console.log(res)
                if(res.status === 201) {
                    this.developer.id = res.data.data.id
                    this.fetchDevelopers()
                    return res
                }

            }).catch(error => {
                console.log('Creating developer')
                return error.response
            })
        },

        updateDeveloper() {
            return api.put(`developers/${this.developer.id}`, this.developer).then(res => {
                this.fetchDevelopersById(this.developer.id)
                this.fetchDevelopers()
                return res
            }).catch(error => {
                console.log('Updating developer')
                console.log(error.response.data)
                return error.response.data
            })
        },

        fetchDevelopersById(id) {
            return api.get(`developers/${id}`).then(res =>{
                if (res.status === 200) {
                    const dev = res.data.data
                    this.developer.id = dev.id
                    this.developer.name = dev.name
                    this.developer.age = dev.age
                    this.developer.birth_date = dev.birth_date
                    this.developer.gender = dev.gender
                    this.developer.hobby = dev.hobby
                    this.developer.level_id = dev.level.id

                    return res
                }
            }).catch( error => {
                console.log('Fetch Delevoper by ID')
                console.log(error.response.data)
                return error.response.data
            })
        }
    },
}
)
