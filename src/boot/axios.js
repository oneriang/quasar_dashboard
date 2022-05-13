import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios
const api = axios.create({ baseURL: 'https://yiersan.link/jiaozi/' })
Vue.prototype.$api = api

Vue.prototype.$axios = axios

export { axios, api }