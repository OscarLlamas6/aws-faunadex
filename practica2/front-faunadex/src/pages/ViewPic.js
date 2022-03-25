import React, { Component } from "react";
import "../css/style.css"
import { Button, Form, Carousel, Modal, ListGroup } from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

class ViewPic extends Component {

    state = {
        albums: [],
        show: false,
        link: "",
        nombre: "",
        descripcion: "",
        lang: "",
        trad: ""
    }

    handleChange=async e=>{
        await this.setState({
            ...this.state,[e.target.name]: e.target.value
        });
    }

    ShowDetail(link, nombre, descripcion) {
        this.setState({
            show: true,
            link: link,
            nombre: nombre, 
            descripcion: descripcion
        })
    }

    handleClose() {
        this.setState({
            show: false,
            link: "",
            nombre: "", 
            descripcion: ""
        })
    }

    componentDidMount() {
        this.getAlbums()
    }

    getAlbums = async () => {
        let userid = window.localStorage.getItem("iduser");
        let req = await http.get(`${globals.enlace}/album/getAlbums/` + userid)
        if (req.error) {
            alert(req.message)
        } else {
            req.result.forEach(elemento => {
                if (elemento.DetalleFoto.length > 0) {
                    this.setState({
                        albums: this.state.albums.concat(elemento)
                    })
                }
            })
        }
    }

    Traduce=async()=>{
        if (this.state.lang === "") {
            alert("No hay idioma seleccionado")
        } else {
            let req = await http.post(`${globals.enlace}/foto/translateDescripcionImagen`,{
                idioma: this.state.lang,
                texto: this.state.descripcion
            })
            if (req.error) {
                alert(req.message)
                console.log(req.message)
            } else {
                console.log(req.message)
                this.setState({
                    trad: req.result.TranslatedText
                })
            }
        }
    }

    render() {
        return (
            <div className="Main">
                <h1>Ver Fotos</h1>
                <div>
                    {
                        this.state.albums.map((album, index) => {
                            return <div key={index}>
                                <h3>{album.nombre}</h3>
                                <Carousel>
                                    {
                                        album.DetalleFoto.map((detalle,index) => { 
                                            return <Carousel.Item key={index}>
                                                <img src={detalle.foto.link} alt="imagen" />
                                                <Carousel.Caption>
                                                    <h4>{detalle.foto.nombre}</h4>
                                                    <br/><Button onClick={()=>this.ShowDetail(detalle.foto.link,detalle.foto.nombre,detalle.foto.descripcion)}>Detalle</Button>
                                                </Carousel.Caption>
                                            </Carousel.Item>
                                        })
                                    }
                                </Carousel>
                            </div>
                        })
                    }
                    <Modal show={this.state.show} onHide={e => this.handleClose()}>
                        <img src={this.state.link} alt="imagen"/>
                        <ListGroup variant="flush">
                            <ListGroup.Item>{this.state.nombre}</ListGroup.Item>  
                            <ListGroup.Item>{this.state.descripcion}</ListGroup.Item>
                            <ListGroup.Item>
                                <Form.Control as="select" name="lang" value={this.state.lang} onChange={this.handleChange}>
                                    <option value=""></option>
                                    <option value="en">Inglés</option>
                                    <option value="de">Alemán</option>
                                    <option value="pt">Portugués</option>
                                    <option value="ja">Japonés</option>
                                </Form.Control>
                                <br/>
                                <Button onClick={()=>this.Traduce()}>Traducir</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>{this.state.trad}</ListGroup.Item>  
                        </ListGroup>
                    </Modal>
                    <Button variant="primary" href="/home">Regresar</Button>
                </div>
            </div>
        )
    }
}

//"https://i.imgur.com/soduoTw.jpeg"

export default ViewPic;