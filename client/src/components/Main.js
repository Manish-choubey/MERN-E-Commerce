import { Component } from 'react';
import CreateProduct from './CreateProduct';
import Home from './Home';
import { Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Cart from './Cart';
import Orders from './Order';
import RegisterModel from './auth/RegisterModel';
import LoginModel from './auth/LoginModel';

class Main extends Component {
    render(){
        return (
            <div>
                <Routes>
                    <Route path='/' element = { <Home/>}/>
                    <Route path='/register' element ={<RegisterModel/>}/>
                    <Route path='/login' element ={<LoginModel/>}/>
                    <Route path='/CreateProduct' element = { <CreateProduct/>}/>
                       
                    <Route path='/cart'  element ={<Cart/>}/>
                        
                    <Route path='/orders' element = { <Orders/>}/>
                       
                   
                   
                </Routes>
            </div>
        )
    }
}

export default (connect()(Main));