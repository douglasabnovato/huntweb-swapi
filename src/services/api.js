import axios from "axios";

const api = axios.create({baseURL : 'http://rocketseat-node.herokuapp.com/api'});

export default api;