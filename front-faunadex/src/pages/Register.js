import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import Cookies from "universal-cookie"

const cookies =new Cookies();

class Register extends Component {

    componentDidMount(){
        if (!cookies.get("iduser")) {
            window.location.href="./"
        }
        console.log(cookies.get("iduser"))
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
                        <Form.Control type="file" />
                    </Form.Group>
                    <br/>
                    <Button variant="primary">Registrar</Button>
                    <br/>
                    <br/>
                    <Button variant="primary" href="/">Regresar</Button>
                </Form>
            </div> 
        )
    }
}

export default Register;