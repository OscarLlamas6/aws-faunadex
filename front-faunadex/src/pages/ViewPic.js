import React, { Component } from "react";
import "../css/style.css"
import { Button, Form, Carousel } from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

class ViewPic extends Component {

    state = {
        albums: [],
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
            console.log(req.result)
            this.setState({ albums: req.result })
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
                                {album.Fotos.map(foto => (
                                    <Carousel.Item key={foto.id}>
                                        <img
                                            src={foto.link}
                                            alt="Imagen"
                                        />
                                        <Carousel.Caption>
                                            <h3>{foto.nombre}</h3>
                                        </Carousel.Caption>
                                    </Carousel.Item>

                                ))}
                            </Carousel>
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default ViewPic;