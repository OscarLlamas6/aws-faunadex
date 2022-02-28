import React, {Component} from "react";
import "../css/style.css"
import {Button,Form,Alert} from "react-bootstrap";
//import axios from "axios";
import Cookies from "universal-cookie"

const cookies =new Cookies();


class Login extends Component {
    state = {
        user: "",
        password: ""
    }

    handleChange=async e=>{
        await this.setState({
            ...this.state,[e.target.name]: e.target.value
        });
        console.log(this.state.user)
    }

    Login=async()=>{
        cookies.set("iduser",1, {path: "/"})
        alert('Bienvenido user');
        window.location.href="./home"
        /*await axios.post("http://localhost:4000/login",  {
            userName: this.state.user,
            password: this.state.password
        })
        .then(response => {
            if (response.data[0] === true) {
                alert("Datos correctos");
            } else {
                alert("Datos incorrectos");
            }
        })
        .catch(error =>{
            console.log(error)
        })*/
    }

    render() {
        return (
            <div className="Main">
                <h2>Login</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuario: </Form.Label>
                        <Form.Control type="text" placeholder="Usuario" name="user" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
                    </Form.Group>
                    <br/>
                    <Button type="button" variant="primary" onClick={()=>this.Login()}>Ingresar</Button>
                    <br/>
                    <br/>
                    <Alert variant="light">No tienes cuenta? <Alert.Link href="/Register">Registrarse</Alert.Link></Alert>
                </Form>
            </div> 
        )
    }
}

export default Login;