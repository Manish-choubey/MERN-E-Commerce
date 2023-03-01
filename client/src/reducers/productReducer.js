import { GET_PRODUCTS, ADD_PRODUCTS, DELETE_PRODUCTS, UPDATE_PRODUCTS, PRODUCTS_LOADING } from '../actions/types';

const initialState = {
    products: [],
    loading: false
}

export default function(state=initialState, action){
    switch(action.type){
        case GET_PRODUCTS:
            return{
                ...state,
                prosucts: action.payload,
                loading: false
            }
        
        case ADD_PRODUCTS:
            return{
                ...state,
                products: [action.payload, ...state.products]
            }
        
        case DELETE_PRODUCTS:
            return{
                ...state,
                products: state.products.filter(product => product._id!==action.payload)                
            };
        
        case UPDATE_PRODUCTS:
            const { id, data } = action.payload;
            return{
                ...state,
                product: state.product.map(product => {
                    if(product._id===id){
                        product = data;
                    }
                })
            }

        case PRODUCTS_LOADING:
            return{
                ...state,
                loading: true
            }

        default:
            return state;
    }
}