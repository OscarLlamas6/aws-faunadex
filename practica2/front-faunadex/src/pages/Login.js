import React, {Component,useRef,useEffect} from "react";
import "../css/style.css"
import {Button,Form,Alert,Modal} from "react-bootstrap";
import http from '../libs/http'
import globals from '../utilities/globals'

let imagen64;

class Login extends Component {
    state = {
        user: "",
        password: "",
        iduser: "",
        show: false
    }

    handleChange=async e=>{
        await this.setState({
            ...this.state,[e.target.name]: e.target.value
        });
    }

    Login=async()=>{
        let req = await http.post(`${globals.enlace}/usuario/login`,{
            userName: this.state.user,
            password: this.state.password
        })
        if (req.error === false) {
            alert("Ingreso exitoso")
            this.setState({
                iduser: req.result.id
            })
            //console.log(req.result)
            window.localStorage.setItem('iduser', this.state.iduser)
            window.localStorage.setItem("pfp",req.result.linkFotoPerfil)
            window.localStorage.setItem("nombre",req.result.nombre)
            window.localStorage.setItem("username",req.result.userName)
            window.localStorage.setItem("password",this.state.password)
            window.location.href="./home"
        } else {
            alert("Datos incorrectos")
        }
    }

    CancelCamera(){
        this.setState({
            show: false
        })
    }

    ModalCamera(){
        this.setState({
            show: true
        })
    }

    LoginCamera=async()=>{
        console.log(imagen64)
        let req = await http.post(`${globals.enlace}/usuario/loginFacial`,{
            UserUsuario: this.state.user,
            FotoBytes: imagen64
        })
        if (req.error === false) {
            alert("Ingreso exitoso")
            this.setState({
                iduser: req.result.id
            })
            //console.log(req.result)
            window.localStorage.setItem('iduser', this.state.iduser)
            window.localStorage.setItem("pfp",req.result.linkFotoPerfil)
            window.localStorage.setItem("nombre",req.result.nombre)
            window.localStorage.setItem("username",req.result.userName)
            window.localStorage.setItem("password",req.result.password)
            window.location.href="./home"
        } else {
            console.log(req.message)
            alert("Datos incorrectos")
        }
    }

    componentDidMount(){
        window.localStorage.clear()
    }

    render() {
        return (
            <div className="Main">
                <h2>Login</h2>
                <Form>
                    <Form.Group>
                        <Form.Label>Usuario: </Form.Label>
                        <Form.Control type="text" placeholder="Usuario" name="user" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password: </Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange}/>
                    </Form.Group>
                    <br/>
                    <Button type="button" variant="primary" onClick={()=>this.Login()}>Ingresar</Button>
                    <br/>
                    <br/>
                    <Button type="button" variant="primary" onClick={()=>this.ModalCamera()}>Ingresar con camara</Button>

                    <Modal show={this.state.show} onHide={e => this.CancelCamera()}>
                        <Modal.Header>
                            <Modal.Title>Ingreso con camara</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Label>Usuario: </Form.Label>
                            <Form.Control type="text" placeholder="Usuario" name="user" onChange={this.handleChange}/>
                            <Webcam></Webcam>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="button" variant="primary" onClick={()=>this.LoginCamera()}>Ingresar</Button>
                            <Button type="button" variant="secondary" onClick={()=>this.CancelCamera()}>Regresar</Button>
                        </Modal.Footer>
                    </Modal>

                    <br/>
                    <Alert variant="light">No tienes cuenta? <Alert.Link href="/Register">Registrarse</Alert.Link></Alert>
                </Form>
            </div> 
        )
    }
}

function Webcam() {
	let videoRef = useRef(null);
    let photoRef = useRef(null)

    const getVideo = () => {
        navigator.mediaDevices
        .getUserMedia({
            video: true
        })
        .then((stream) => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const takePicture = () => {
        const width = 400
        const height = width / (16 / 9)
        let video = videoRef.current
        let photo = photoRef.current
        photo.width = width
        photo.height = height
        let ctx = photo.getContext('2d')
        ctx.drawImage(video, 0, 0, width, height)
        imagen64 = photo.toDataURL().split(",")[1]
    }

    const clearImage = () => {
        let photo = photoRef.current
        let ctx = photo.getContext('2d')
        ctx.clearRect(0,0,photo.width,photo.height)
    }

    useEffect(() => {
        getVideo();
    }, [videoRef]);

    return (
        <div className="container">
        <video ref={videoRef} className="container"></video>
        <button onClick={takePicture} className="btn btn-danger container">Capturar</button>
        <canvas className="container" ref={photoRef}></canvas>
        <button onClick={clearImage} className="btn btn-primary container">Limpiar</button>
        <br/><br/>
        </div>
    );
}

export default Login;