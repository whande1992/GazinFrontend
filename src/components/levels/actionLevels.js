import Swal from 'sweetalert2'
import api from '../../services/api.js'
import {useDeveloperStore} from '../../store/developers.js'
import {useLevelStore} from '../../store/levels.js'

export default function createLevel() {

    const developerStore = useDeveloperStore()
    const levelStore = useLevelStore()

    function getLevels() {
        api.get('levels?per_page=10000').then(res => {
            console.log(res)
            levelStore.levels = res.data.data
        })

        levelStore.fetchTopLevels()
    }

    function updateLevel(level) {
        return api.put(`levels/${levelStore.levelSelected.id}`, {
            'level': level
        }).then(res => {
            console.log('dentro o then')
            console.log(res)
            if (res.status === 200) {
                getLevels()

                showMessage(`Sucesso ;)`,
                    `O nível "${level}" foi atualizado.`)
            }
        }).catch(error => {
            console.log(error)
            if (error.response.status === 400) {
                Swal.showValidationMessage(
                    error.response.data.data.level
                )
            }

        })
    }

    function postLevel(level) {
        return api.post('levels', {
            'level': level
        }).then(res => {
            console.log(res.data.data.id)
            if (res.status === 201) {

                new Promise((resolve, reject) => {
                    resolve(getLevels())
                }).then(() => {
                    developerStore.developer.level_id = res.data.data.id
                })

                showMessage(`Sucesso ;)`,
                    `O nível "${level}" foi adicionado.`)
            }
        }).catch(error => {
            if (error.response.status === 400) {
                Swal.showValidationMessage(
                    error.response.data.data.level
                )
            }
        })
    }

    Swal.fire({
        title: levelStore.levelSelected.id ? levelStore.levelSelected.level : 'Novo Nível',
        text: levelStore.levelSelected.id ? 'Informe um novo nome para o nível ' : 'Informe a descrição do nível',
        input: 'text',

        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        showLoaderOnConfirm: true,

        customClass: {
            cancelButton: 'btn btn-danger m-2',
            confirmButton: 'btn btn-primary m-2',
        },
        buttonsStyling: false,

        preConfirm: (level) => {
            if (levelStore.levelSelected.level) {
                return updateLevel(level)
            } else {
                return postLevel(level)
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    })

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
}