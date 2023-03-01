import axios from 'axios';
import { GET_PRODUCTS, ADD_PRODUCTS, DELETE_PRODUCTS, UPDATE_PRODUCTS, PRODUCTS_LOADING } from './types';
import { returnErrors } from './errorActions';

export const getProducts = () => dispatch => {
    dispatch(setProductsLoading());
    axios.get('/products')
        .then(res => dispatch({
            type: GET_PRODUCTS,
            payload: res.data
        }))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

export const createProduct = (product) => (dispatch) => {
    axios.post('/products', product)
        .then(res => dispatch({
            type: ADD_PRODUCTS,
            payload: res.data
        }))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const delProductsById = (productId) => (dispatch) => {
    axios.delete('/products/:productId')
        .then(res => dispatch({
            type: DELETE_PRODUCTS,
            payload: productId
        }))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const updateProduct = (id, product) => (dispatch) => {
    axios.put('/products/:productId', product)
        .then(res => dispatch({
            type: UPDATE_PRODUCTS,
            payload: Promise.all([id, res.data])
        }))
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const setProductsLoading = () => {
    return{
        type: PRODUCTS_LOADING
    }
}