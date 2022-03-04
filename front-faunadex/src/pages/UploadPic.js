import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import Cookies from "universal-cookie"

const cookies =new Cookies();

class UploadPic extends Component {

    componentDidMount(){
        if (!cookies.get("iduser")) {
            window.location.href="./"
        }
        console.log(cookies.get("iduser"))
    }

    render() {
        return (
            <div className="Main">
                <h1>Subir Foto</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" />
                        <Form.Label>Elegir Foto</Form.Label>
                        <Form.Control type="file" />
                        <Form.Label>Album: </Form.Label>
                        <Form.Control as="select">
                            <option value="nuevo">Nuevo Album</option>
                            <option value="album1">Album 1</option>
                        </Form.Control>
                    </Form.Group>
                    <br/>
                    <Button variant="primary">Guardar</Button>
                    <br/>
                    <br/>
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
            </div> 
        )
    }
}

export default UploadPic;