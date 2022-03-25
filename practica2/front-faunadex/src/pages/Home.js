import React, {Component} from "react";
import "../css/style.css"
import {Button,Card,ListGroup,Badge,Form} from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

var reader = new FileReader();

class Home extends Component {
    state = {
        user: "",
        name: "",
        profilepic: "",
        iduser: "",
        tagspfp: [],
        texto: ""
    }

    handleImage = async e => {
        reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function () {
            //BASE 64
            //console.log(reader.result);
        };
    }

    logout() {
        window.localStorage.clear()
        window.location.href="./"
        this.setState({
            tagspfp: []
        })
    }

    componentDidMount(){
        if (! window.localStorage.getItem("iduser")) {
            window.location.href="./"
        }
        this.setState({
            user: window.localStorage.getItem("username"),
            name: window.localStorage.getItem("nombre"),
            profilepic: window.localStorage.getItem("pfp"),
            iduser: window.localStorage.getItem("iduser")
        })
        this.GetTags()
    }

    GetTags=async()=>{
        let req = await http.get(`${globals.enlace}/usuario/getTagsFotoPerfil/?UsuarioId=` + window.localStorage.getItem("iduser"))
        if (req.error) {
            console.log(req.message)
        } else {
            req.result.forEach(element => 
                this.setState({
                    tagspfp: this.state.tagspfp.concat(element.Name)
                })    
            )
        }
    }

    ExtraerTexto=async()=>{
        this.setState({
            texto: ""
        })
        let req = await http.post(`${globals.enlace}/foto/getTextImagen`,{
            imagenBase64: reader.result.split(",")[1]
        })
        if (req.error === false) {
            console.log(req.message)
            req.result.TextDetections.forEach(text => {
                if (text.Type === "LINE") {
                    this.setState({
                        texto: this.state.texto.concat(text.DetectedText)
                    }) 
                }
            })
            console.log(this.state.texto)
        } else {
            console.log(req.message)
        }
    }

    render() {
        return (
            <div className="Main">
                <h2>Pagina de Inicio</h2>
                <div>
                <Card>
                    <Card.Body>
                        <img src={this.state.profilepic} alt="Imagen de Perfil" width="30%" height="30%" />
                        <br/>
                        <label>Etiqeutas:</label>
                        <br/>
                        {
                            this.state.tagspfp.map((tag,index) => ( <Badge key={index} pill bg="primary">{tag}</Badge> ))
                        }
                        <Card.Title>Datos Personales</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Usuario: {this.state.user}</ListGroup.Item>
                            <ListGroup.Item>Nombre Completo: {this.state.name}</ListGroup.Item>
                            <ListGroup.Item>
                                <Button variant="primary" href="/editprofile">Editar Perfil</Button>
                                <Button variant="primary" href="/uploadpic">Subir Foto</Button>
                                <Button variant="primary" href="/viewpic">Ver Fotos</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Form.Control type="file" name="picture" onChange={this.handleImage} accept=".jpg,.png"/>
                                <Button variant="primary" onClick={()=>this.ExtraerTexto()}>Extraer Texto</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {this.state.texto}
                            </ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" onClick={()=>this.logout()}>Cerrar Sesion</Button>
                    </Card.Body>
                </Card>
                </div>
                
            </div> 
        )
    }
}

export default Home;