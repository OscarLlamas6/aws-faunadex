import React, { Component } from "react";
import "../css/style.css"
import { Button, Form } from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

class EditAlbum extends Component {

    state = {
        user: "",
        name: "",
        albums: [],
        nombreNuevo: "",
        selecalbum: ""
    }

    componentDidMount() {
        if (!window.localStorage.getItem("iduser")) {
            window.location.href = "./"
        }
        this.getAlbums()
    }

    handleChange = async e => {
        await this.setState({
            ...this.state, [e.target.name]: e.target.value
        });
    }

    getAlbums = async () => {
        let userid = window.localStorage.getItem("iduser");
        let req = await http.get(`http://${globals.host}:${globals.puerto}/album/getAlbums/` + userid)
        if (req.error) {
            alert(req.message)
        } else {
            console.log(req.result)
            this.setState({ albums: req.result })
        }
    }

    createAlbum = async () => {
        let userid = window.localStorage.getItem("iduser");
        let req = await http.post(`http://${globals.host}:${globals.puerto}/album/crearAlbum`, {
            nombre: this.state.name,
            idUsuario: userid
        })
        if (req.error) {
            alert(req.message)
        } else {
            alert("Album creado correctamente")
        }
        await this.getAlbums()
        console.log(req)
    }

    editAlbum = async () => {
        console.log(this.state)
        let req = await http.put(`http://${globals.host}:${globals.puerto}/album/editarAlbum`, {
            nombre: this.state.nombreNuevo,
            idAlbum: this.state.selecalbum
        })
        if (req.error) {
            alert(req.message)
        } else {
            alert("Album editado correctamente")
        }
        await this.getAlbums()
    }

    deleteAlbum = async () => {
        let req = await http.delete(`http://${globals.host}:${globals.puerto}/album/eliminarAlbum/` + this.state.selecalbum)
        if (req.error) {
            alert(req.message)
        } else {
            alert(req.message)
            await this.getAlbums()
        }
    }

    render() {
        return (
            <div className="Main">
                <h1>Editar Album</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Album: </Form.Label>
                        <Form.Control as="select" value={this.state.selecalbum} onChange={(e) => this.setState({ selecalbum: e.target.value })}>
                            {this.state.albums.map(album =>
                            (<option key={album.id} value={album.id}>
                                {album.nombre}</option>))}
                        </Form.Control>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="nombreNuevo" onChange={this.handleChange} />
                        <Form.Label>
                            <Button variant="primary" onClick={() => this.editAlbum()}>Guardar</Button>
                            <Button variant="danger" onClick={() => this.deleteAlbum()}>Eliminar</Button>
                        </Form.Label>
                        <h2>Nuevo Album</h2>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="name" onChange={this.handleChange} />
                        <Button variant="primary" onClick={() => this.createAlbum()}>Crear</Button>
                    </Form.Group>
                    <br />
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
            </div>
        )
    }
}

export default EditAlbum;