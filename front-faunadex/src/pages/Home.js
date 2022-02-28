import React, {Component} from "react";
import "../css/style.css"
import {Button,Card,ListGroup} from "react-bootstrap";
import Cookies from "universal-cookie"

const cookies =new Cookies();

class Home extends Component {

    logout() {
        cookies.remove("iduser", {path: "/"})
        window.location.href="./"
    }

    componentDidMount(){
        if (!cookies.get("iduser")) {
            window.location.href="./"
        }
        console.log(cookies.get("iduser"))
    }

    render() {
        return (
            <div className="Main">
                <h2>Pagina de Inicio</h2>
                <div>
                <Card>
                    <Card.Img variant="top" src="" />
                    <Card.Body>
                        <Card.Title>Datos Personales</Card.Title>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Usuario: </ListGroup.Item>
                            <ListGroup.Item>Nombre Completo: </ListGroup.Item>
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