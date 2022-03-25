import React, { Component } from "react";
import "../css/style.css"
import { Button, Form } from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

var reader = new FileReader();

class UploadPic extends Component {

    state = {
        albums: [],
        selecalbum: "",
        name: "",
        desc: ""
    }

    componentDidMount() {
        if (!window.localStorage.getItem("iduser")) {
            window.location.href = "./"
        }
    }

    createFoto = async () => {
        let req = await http.post(`${globals.enlace}/foto/createFotoAnimal`, {
            nombre: this.state.name,
            descripcion: this.state.desc,
            idUsuario: window.localStorage.getItem("iduser"),
            imagenBase64: reader.result.split(",")[1]
        })
        if (req.error) {
            console.log(req.message)
        } else {
            alert(req.message)
        }
    }

    handleImage = async e => {
        reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            //BASE 64
            //console.log(reader.result);
        };
    }

    handleChange = async e => {
        await this.setState({
            ...this.state, [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <div className="Main">
                <h1>Subir Foto</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="name" onChange={this.handleChange} />
                        <Form.Label>Elegir Foto</Form.Label>
                        <Form.Control type="file" onChange={this.handleImage} accept=".jpg,.png,.jpeg" />
                        <Form.Label>Descripcion: </Form.Label>
                        <Form.Control type="textarea" placeholder="Descripcion" name="desc" onChange={this.handleChange} />
                    </Form.Group>
                    <br />
                    <Button variant="primary" onClick={() => this.createFoto()}>Guardar</Button>
                    <br />
                    <br />
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
            </div>
        )
    }
}

export default UploadPic;