import React, { Component } from "react";
import "../css/style.css"
import { Button, Form } from "react-bootstrap";
import Cookies from "universal-cookie"
import http from '../libs/http'

const cookies = new Cookies();

class Register extends Component {

    componentDidMount() {

    }

    registrarse = async () => {
        window.localStorage.setItem('idUsuario', '1')
    }

    handleChange = async e => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        // http.post()
        reader.onload = function () {
            //ESTE PRINT ES EL BASE64
            console.log(reader.result);
        };
    }

    render() {
        return (
            <div className="Main" >
                <h2>Registro</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuario: </Form.Label>
                        <Form.Control type="text" placeholder="Usuario" />
                        <Form.Label>Nombre Completo: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre Completo" />
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                        <Form.Label>Confirmar Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                        <Form.Label>Elegir Foto</Form.Label>
                        <Form.Control type="file" onChange={this.handleChange} accept=".jpg,.png" />
                    </Form.Group>
                    <br />
                    <Button onClick={this.registrarse} variant="primary">Registrar</Button>
                    <br />
                    <br />
                    <Button variant="primary" href="/">Regresar</Button>
                </Form>
            </div>
        )
    }
}

export default Register;