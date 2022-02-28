import React, {Component} from "react";
import "../css/style.css"
import {Button,Form} from "react-bootstrap";
import Cookies from "universal-cookie"

const cookies =new Cookies();

class ViewPic extends Component {

    componentDidMount(){
        if (!cookies.get("iduser")) {
            window.location.href="./"
        }
        console.log(cookies.get("iduser"))
    }

    render() {
        return (
            <div className="Main">
                <h1>Ver Fotos</h1>
                <Form>
                    <Form.Group>
                        <Button variant="primary" href="/uploadpic">Subir Foto</Button>
                        <Button variant="primary" href="editalbum">Editar Album</Button>
                    </Form.Group>
                    
                    <br/>
                    <Button variant="primary" href="/home">Regresar</Button>
                </Form>
            </div> 
        )
    }
}

export default ViewPic;