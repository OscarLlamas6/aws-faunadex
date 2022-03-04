import React, {Component} from "react";
import "../css/style.css"
import {Button,Card,ListGroup} from "react-bootstrap";

class Home extends Component {
    state = {
        user: "",
        name: "",
        profilepic: "",
    }

    logout() {
        window.localStorage.clear()
        window.location.href="./"
    }

    componentDidMount(){
        if (! window.localStorage.getItem("iduser")) {
            window.location.href="./"
        }
        this.setState({
            user: window.localStorage.getItem("username"),
            name: window.localStorage.getItem("nombre"),
            profilepic: window.localStorage.getItem("pfp")
        })
    }

    render() {
        return (
            <div className="Main">
                <h2>Pagina de Inicio</h2>
                <div>
                <Card>
                    <Card.Body>
                        <img src={this.state.profilepic} alt="Imagen de Perfil" width="30%" height="30%" />
                        <Card.Title>Datos Personales</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Usuario: {this.state.user}</ListGroup.Item>
                            <ListGroup.Item>Nombre Completo: {this.state.name}</ListGroup.Item>
                            <ListGroup.Item>
                                <Button variant="primary" href="/editprofile">Editar Perfil</Button>
                                <Button variant="primary" href="/editalbum">Editar Album</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button variant="primary" href="/uploadpic">Subir Foto</Button>
                                <Button variant="primary" href="/viewpic">Ver Fotos</Button>
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