import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import http from '../libs/http'

class EditAlbum extends Component {

    state = {
        user: "",
        name: ""
    }

    componentDidMount(){
        if (!window.localStorage.getItem("iduser")) {
            window.location.href="./"
        }
    }

    handleChange=async e=>{
        await this.setState({
            ...this.state,[e.target.name]: e.target.value
        });
    }

    createAlbum = async()=>{
        let userid = window.localStorage.getItem("iduser");
        let req = await http.post('http://localhost:4000/album/crearAlbum',{
                nombre: this.state.name,
                idUsuario: userid
            })
            if (req.error) {
                alert("Error al crear album")
            } else {
                alert("Album creado correctamente")
            }
            console.log(req)
    }

    render() {
        return (
            <div className="Main">
                <h1>Editar Album</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Album: </Form.Label>
                        <Form.Control as="select">
                            <option value="nuevo">Nuevo Album</option>
                            <option value="album1">Album 1</option>
                        </Form.Control>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="name" onChange={this.handleChange}/>
                        <Form.Label>
                            <Button variant="primary">Guardar</Button>
                            <Button variant="danger">Eliminar</Button>
                        </Form.Label>
                        <h2>Nuevo Album</h2>
                        <Form.Label>Nombre: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="name" onChange={this.handleChange}/>
                        <Button variant="primary" onClick={()=>this.createAlbum()}>Crear</Button>
                    </Form.Group>
                    <br/>
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
            </div> 
        )
    }
}

export default EditAlbum;