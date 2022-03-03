import React, {Component} from "react";
import "../css/style.css"
import {Button,Form,Alert} from "react-bootstrap";
import http from '../libs/http'

class Login extends Component {
    state = {
        user: "",
        password: "",
        iduser: ""
    }

    handleChange=async e=>{
        await this.setState({
            ...this.state,[e.target.name]: e.target.value
        });
    }

    Login=async()=>{
        let req = await http.post('http://localhost:4000/usuario/login',{
            userName: this.state.user,
            password: this.state.password
        })
        if (req.error === false) {
            alert("Ingreso exitoso")
            this.setState({
                iduser: req.result.id
            })
            console.log(req.result)
            window.localStorage.setItem('iduser', this.state.iduser)
            window.localStorage.setItem("pfp",req.result.linkFotoPerfil)
            window.localStorage.setItem("nombre",req.result.nombre)
            window.localStorage.setItem("username",req.result.userName)
            window.localStorage.setItem("password",this.state.password)
            window.location.href="./home"
        } else {
            alert("Datos incorrectos")
        }
    }

    componentDidMount(){
        window.localStorage.clear()
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