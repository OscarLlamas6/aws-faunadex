import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import Cookies from "universal-cookie"

const cookies =new Cookies();

class EditProfile extends Component {

    componentDidMount(){
        if (!cookies.get("iduser")) {
            window.location.href="./"
        }
        console.log(cookies.get("iduser"))
    }

    render() {
        return (
            <div className="Main">
                <h1>Editar Perfil</h1>
                <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuario: </Form.Label>
                        <Form.Control type="text" placeholder="Usuario" />
                        <Form.Label>Nombre Completo: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre Completo" />
                        <Form.Label>Elegir Foto</Form.Label>
                        <Form.Control type="file" />
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <br/>
                    <Button variant="primary">Guardar</Button>
                    <br/>
                    <br/>
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
                </div>
            </div> 
        )
    }
}

export default EditProfile;