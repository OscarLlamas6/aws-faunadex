import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import http from '../libs/http'

var reader = new FileReader();

class EditProfile extends Component {
    state = {
        user: "",
        name: "",
        picture: "",
        password: ""
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

    handleImage = async e => {
        reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            //BASE 64
            //console.log(reader.result);
        };
    }

    EditUser=async()=>{
        if (this.state.password === window.localStorage.getItem("password")) {
            let userid = window.localStorage.getItem("iduser");
             //console.log(window.localStorage.getItem("iduser"),this.state.user,this.state.name,this.state.password,reader.result.split(",")[1]);
            let req = await http.put('http://localhost:4000/usuario/updateUsuario',{
                usuarioId: userid,
                userName: this.state.user,
                nombre: this.state.name,
                password: this.state.password
            })
            if (req.error) {
                alert("Error al actualizar")
            } else {
                alert("Actualizado correctamente")
            }
            console.log(req)
        } else {
            alert("Contraseña incorrecta")
        }
    }

    render() {
        return (
            <div className="Main">
                <h1>Editar Perfil</h1>
                <div>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuario: </Form.Label>
                        <Form.Control type="text" placeholder="Usuario" name="user" onChange={this.handleChange}/>
                        <Form.Label>Nombre Completo: </Form.Label>
                        <Form.Control type="text" placeholder="Nombre" name="name" onChange={this.handleChange}/>
                        <Form.Label>Elegir Foto</Form.Label>
                        <Form.Control type="file" onChange={this.handleImage} accept=".jpg,.png"/>
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
                    </Form.Group>
                    <br/>
                    <Button variant="primary" onClick={()=>this.EditUser()}>Guardar</Button>
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