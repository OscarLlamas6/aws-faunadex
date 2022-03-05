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
        name: ""
    }

    componentDidMount() {
        if (!window.localStorage.getItem("iduser")) {
            window.location.href = "./"
        }
    }

    componentDidMount() {
        this.getAlbums()
    }

    getAlbums = async () => {
        let userid = window.localStorage.getItem("iduser");
        let req = await http.get(`http://${globals.host}:4000/album/getAlbums/` + userid)
        if (req.error) {
            alert(req.message)
        } else {
            console.log(req.result)
            this.setState({ albums: req.result })
        }
    }

    createFoto = async () => {

        if(this.state.albums.length == 0)return
        else await this.setState({selecalbum: this.state.albums[0].id})

        let req = await http.post(`http://${globals.host}:4000/foto/subirFoto`, {
            nombre: this.state.name,
            idAlbum: this.state.selecalbum,
            linkFoto: reader.result.split(",")[1]
        })
        if (req.error) {
            alert(req.message)
        } else {
            alert(req.message)
        }
        await this.getAlbums()
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
                        <Form.Control type="file" onChange={this.handleImage} accept=".jpg,.png" />
                        <Form.Label>Album: </Form.Label>
                        <Form.Control as="select" value={this.state.selecalbum} onChange={(e) => this.setState({ selecalbum: e.target.value })}>
                            {this.state.albums.map(album =>
                            (<option key={album.id} value={album.id}>
                                {album.nombre}</option>))}
                        </Form.Control>
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