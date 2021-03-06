#importaciones
from traceback import print_tb
import boto3
import base64 
import uuid
import io
import os
#Flask y Config
from flask import Flask, request, redirect,jsonify,json
from flask_cors import CORS, cross_origin
from copy import Error
from botocore.config import Config
import hashlib
import mysql.connector
from dotenv import load_dotenv

# Setting env variables
load_dotenv()
DB_HOST = os.environ['DB_HOST']
DB_USER = os.environ['DB_USER']
DB_PASS = os.environ['DB_PASS']
DB_NAME = os.environ['DB_NAME']

AWS_REGION = os.environ['AWS_REGION']
AWS_ACCESS_KEY = os.environ['AWS_ACCESS_KEY']
AWS_SECRET_KEY = os.environ['AWS_SECRET_KEY']
BUCKET_NAME = os.environ['BUCKET_NAME']


mydb = mysql.connector.connect(
  host=DB_HOST,
  user=DB_USER,
  password=DB_PASS,
  database=DB_NAME
)

app = Flask(__name__)
CORS(app, support_credentials=True)

s3=boto3.resource(
    's3',
    config=Config(
        region_name = AWS_REGION
    ),
    aws_access_key_id = AWS_ACCESS_KEY,
    aws_secret_access_key = AWS_SECRET_KEY
)

#Peticiones
@app.route('/', methods=['GET']) 
@cross_origin(supports_credentials=True)
def root():
    return jsonify({
        "mensaje": "BACKEND PYTHON | AWS SEMI1 :D",
    })

@app.route('/usuario/registro', methods=['POST']) 
@cross_origin(supports_credentials=True)
def registrar():
    
    try:
        #leyendo json
        respuesta = request.get_json()
        userName=respuesta['userName']
        nombre=respuesta['nombre']
        password=respuesta['password']
        imgStr = respuesta['linkFotoPerfil']
        
        encryptedPass = hashlib.md5(password.encode('utf-8')).hexdigest()

        #creamos su idUnico
        idUnico=str(uuid.uuid4())

        #convierto a b64
        imageb64 = base64.b64decode(imgStr)

        #parametros S3
        paramS3 = {
            'ContentType':'image/jpg'
        }
        dirURL ='http://' + BUCKET_NAME + '.s3.' + AWS_REGION + '.amazonaws.com/Fotos_Perfil/'+idUnico+'.jpg'
        pathFoto="Fotos_Perfil/"+idUnico+'.jpg'
        nbucket = s3.Bucket(BUCKET_NAME)
        nbucket.upload_fileobj(io.BytesIO(imageb64),pathFoto,paramS3)

        mycursor = mydb.cursor()
        sql = "INSERT INTO semi1practica1.Usuarios (userName, nombre, password, linkFotoPerfil) VALUES (%s, %s, %s, %s)"
        val = (userName, nombre, encryptedPass, dirURL)
        mycursor.execute(sql, val)
        
        idUsuario = str(mycursor.lastrowid)
        sql2 = "INSERT INTO semi1practica1.Albums (nombre, idUsuario) VALUES (%s, %s)"
        val2 = ("FotosPerfil", idUsuario)
        mycursor.execute(sql2, val2)
        
        idAlbum = str(mycursor.lastrowid)
        sql3 = "INSERT INTO semi1practica1.Fotos (nombre, link, idAlbum) VALUES (%s, %s, %s)"
        val3 = (str(idUsuario)+"-"+idUnico, dirURL, idAlbum)
        mycursor.execute(sql3, val3)
        
        mydb.commit()

        return jsonify({
            "result": True,
            "error": False,
            "message": "Usuario registrado correctamente"
            }), 201 
    except:
        return jsonify({
            "result": False,
            "error": True,
            "message": "Error al registrar nuevo usuario"
            }), 400               

@app.route('/usuario/login', methods=['POST']) 
@cross_origin(supports_credentials=True)
def login():
    try:
        
        #leyendo json
        respuesta = request.get_json()
        userName=respuesta['userName']
        password=respuesta['password']
        encryptedPass = hashlib.md5(password.encode('utf-8')).hexdigest()
        
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Usuarios WHERE userName = %s AND password = %s"
        val = (userName, encryptedPass)
        mycursor.execute(sql, val)
        # Fetch one record and return result
        account = mycursor.fetchone()
        
        if account: 
            
            userInfo = {
                "id" : account[0],
                "userName" : account[1],
                "nombre" : account[2],
                "password" : account[3],
                "linkFotoPerfil" : account[4]
            }
            
            return jsonify({
                "result": userInfo,
                "error": False,
                "message": "Loggeo exitoso"
                }), 201
        
        else: 
            return jsonify({
            "result": "",
            "error": True,
            "message": "Credenciales invalidas o usuario inexistente"
            }), 400
        
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Credenciales invalidas o usuario inexistente"
            }), 400 

@app.route('/usuario/updateUsuario', methods=['PUT']) 
@cross_origin(supports_credentials=True)
def update():
    
    try:    
        #leyendo json
        respuesta = request.get_json()
        idUsuario=respuesta['usuarioId']
        userName=respuesta['userName']
        nombre=respuesta['nombre']
        
        print(idUsuario)
        print(userName)
        print(nombre)
    
        
        mycursor = mydb.cursor()
        
        sql3 = "SELECT * FROM semi1practica1.Usuarios WHERE id != %s AND userName = %s"
        val3 = (idUsuario, userName)
        mycursor.execute(sql3, val3)
        myUser = mycursor.fetchone()
        
        if myUser:
             return jsonify({
            "result": "",
            "error": True,
            "message": "Ya existe un usuario con ese userName"
            }), 400 
        
        
        sql = "UPDATE semi1practica1.Usuarios SET userName = %s, nombre = %s WHERE id = %s"
        val = (userName, nombre, idUsuario)
        mycursor.execute(sql, val)
        
        mydb.commit()
        
        sql = "SELECT * FROM semi1practica1.Usuarios WHERE id = " + str(idUsuario)
        mycursor.execute(sql)
        # Fetch one record and return result
        updatedUser = mycursor.fetchone()
        
        if updatedUser:
            
            userInfo = {
                    "userName" : updatedUser[1],
                    "nombre" : updatedUser[2]
                }
            
            return jsonify({
            "result": userInfo,
            "error": False,
            "message": "Usuario actualizado correctamente"
            }), 200 
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar usuario"
            }), 400
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar usuario"
            }), 400            
           
@app.route('/usuario/updateFotoPerfil', methods=['PUT']) 
@cross_origin(supports_credentials=True)
def updateFotoPerfil():
    
    try:
        #leyendo json
        respuesta = request.get_json()
        idUsuario=respuesta['usuarioId']
        imgStr = respuesta['linkFotoPerfil']
        
        #creamos su idUnico
        idUnico=str(uuid.uuid4())

        #convierto a b64
        imageb64 = base64.b64decode(imgStr)

        #parametros S3
        paramS3 = {
            'ContentType':'image/jpg'
        }
        dirURL ='http://' + BUCKET_NAME + '.s3.' + AWS_REGION + '.amazonaws.com/Fotos_Perfil/'+idUnico+'.jpg'
        pathFoto="Fotos_Perfil/"+idUnico+'.jpg'
        nbucket = s3.Bucket(BUCKET_NAME)
        nbucket.upload_fileobj(io.BytesIO(imageb64),pathFoto,paramS3)
        
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Albums WHERE nombre = %s AND IdUsuario = %s"
        val = ("FotosPerfil", idUsuario)
        mycursor.execute(sql, val)
        # Fetch one record and return result
        myAlbum = mycursor.fetchone()
        
        if myAlbum: 
            
            idAlbum = myAlbum[0]
            mycursor = mydb.cursor()
            sql2 = "INSERT INTO semi1practica1.Fotos (nombre, link, IdAlbum) VALUES (%s, %s, %s)"
            val2 = (str(idUsuario)+"-"+idUnico, dirURL, idAlbum)
            mycursor.execute(sql2, val2)
            mydb.commit()       
       
            return jsonify({
                "result": dirURL,
                "error": False,
                "message": "Foto de perfil actualizada correctamente"
                }), 201
        else:
    
            return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar foto de perfil"
            }), 400      
            
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar foto de perfil"
            }), 400    
         
@app.route('/usuario/getUsuario/<id>', methods=['GET']) 
@cross_origin(supports_credentials=True)
def getProfile(id):
    
    try:
        #leyendo json
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Usuarios WHERE id = " + id
        mycursor.execute(sql)
        # Fetch one record and return result
        selectedUser = mycursor.fetchone()
        
        if selectedUser:
            return jsonify({
                "result": selectedUser,
                "error": False,
                "message": "Perfil del usuario leido correctamente"
                }), 200
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Usuario no encontrado"
            }), 400  
            
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Usuario no encontrado"
            }), 400  
      
@app.route('/album/crearAlbum', methods=['POST']) 
@cross_origin(supports_credentials=True)
def album():
    
    try:
        #leyendo json
        respuesta = request.get_json()
        idUsuario=respuesta['idUsuario']
        nombre=respuesta['nombre']
               
        mycursor = mydb.cursor()
        
        sql2 = "SELECT * FROM semi1practica1.Albums WHERE idUsuario = %s AND nombre = %s"
        val2 = (idUsuario, nombre)
        mycursor.execute(sql2, val2)
        resultado2 = mycursor.fetchone()
        
        if resultado2:
             return jsonify({
            "result": "",
            "error": True,
            "message": "Ya existe un album con ese nombre"
            }), 400
        
        
        
        sql = "INSERT INTO semi1practica1.Albums (nombre, idUsuario) VALUES (%s, %s)"
        val = (nombre, idUsuario)
        mycursor.execute(sql, val)
        mydb.commit()
        
        id = str(mycursor.lastrowid)
        
        sql = "SELECT * FROM semi1practica1.Albums WHERE id = " + id
        mycursor.execute(sql)
        # Fetch one record and return result
        selectedAlbum = mycursor.fetchone()
        
        if selectedAlbum:
            
            newAlbum = {
                "idAlbum": selectedAlbum[0],
                "nombre": selectedAlbum[1],
                "idUsuario": selectedAlbum[2]
            }
            
            return jsonify({
                "result": newAlbum,
                "error": False,
                "message": "Album creado correctamente, id#: " + id
                }), 201 
        else:
            return jsonify({
                "result": "",
                "error": True,
                "message": "Error al crear nuevo album"
                }), 400    

        
    except:
        return jsonify({
            "result": False,
            "error": True,
            "message": "Error al crear nuevo album"
            }), 400    

@app.route('/album/editarAlbum', methods=['PUT']) 
@cross_origin(supports_credentials=True)
def updateAlbum():
    try:
        
        #leyendo json
        respuesta = request.get_json()
        idAlbum=respuesta['idAlbum']
        nombre=respuesta['nombre']

        mycursor = mydb.cursor() 
        sql3 = "SELECT * FROM semi1practica1.Albums WHERE id = " + str(idAlbum)
        mycursor.execute(sql3)
        resultado = mycursor.fetchone()
        
        if resultado and resultado[1] == "FotosPerfil":
             return jsonify({
            "result": "",
            "error": True,
            "message": "No se puede editar este album"
            }), 400
               
        
        sql = "UPDATE semi1practica1.Albums SET nombre = %s WHERE id = %s"
        val = (nombre, idAlbum)
        mycursor.execute(sql, val)
        
        mydb.commit()
        
        sql = "SELECT * FROM semi1practica1.Albums WHERE id = " + str(idAlbum)
        mycursor.execute(sql)
        # Fetch one record and return result
        updatedAlbum = mycursor.fetchone()
        
        if updatedAlbum:
            
            albumInfo = {
                "idAlbum": updatedAlbum[0],
                "nombre": updatedAlbum[1],
                "idUsuario": updatedAlbum[2]
            }
            
            return jsonify({
            "result": albumInfo,
            "error": False,
            "message": "Album actualizado correctamente"
            }), 200 
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar album"
            }), 400
              
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Error al actualizar album"
            }), 400
    
@app.route('/album/eliminarAlbum/<id>', methods=['DELETE']) 
@cross_origin(supports_credentials=True)
def deleteAlbum(id):
    
    try:
        #leyendo json
        mycursor = mydb.cursor()
        sql = "DELETE FROM semi1practica1.Albums WHERE id = " + id
        mycursor.execute(sql)
        mydb.commit()
               
        return jsonify({
            "result": True,
            "error": False,
            "message": "Album eliminado correctamente"
            }), 200   
            
    except:
        return jsonify({
            "result": False,
            "error": True,
            "message": "Error al eliminar album"
            }), 400    

@app.route('/album/getAlbum/<id>', methods=['GET']) 
@cross_origin(supports_credentials=True)
def getAlbum(id):
    
    try:
        #leyendo json
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Albums WHERE id = " + id
        mycursor.execute(sql)
        # Fetch one record and return result
        selectedAlbum = mycursor.fetchone()
        
        if selectedAlbum:
            
            albumInfo = {
                "idAlbum": selectedAlbum[0],
                "nombre": selectedAlbum[1],
                "idUsuario": selectedAlbum[2]
            }
            
            return jsonify({
                "result": albumInfo,
                "error": False,
                "message": "Album obtenido correctamente"
                }), 200
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Album no encontrado"
            }), 400  
            
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Album no encontrado"
            }), 400    

@app.route('/album/getAlbums/<idUsuario>', methods=['GET']) 
@cross_origin(supports_credentials=True)
def getAlbumByUser(idUsuario):
    
    try:
        #leyendo json
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Albums WHERE IdUsuario = " + idUsuario
        mycursor.execute(sql)
        selectedAlbums = mycursor.fetchall()
        
        if selectedAlbums:
            
            myResults = []          
            for x in selectedAlbums:
                albumInfo = {
                    "id": x[0],
                    "nombre": x[1],
                    "idUsuario": x[4],
                    "Fotos" : []
                }
           
                myResults.append(albumInfo)
            
            for album in myResults:
                albumID = str(album["id"])
                sql2 = "SELECT * FROM semi1practica1.Fotos WHERE IdAlbum = " + albumID
                mycursor.execute(sql2)
                selectedFotos = mycursor.fetchall()
                
                for x in selectedFotos:
                    FotoInfo = {
                        "id": x[0],
                        "nombre": x[1],
                        "link": x[2]
                    }                
                    album['Fotos'].append(FotoInfo)  
                
              
            return jsonify({
                "result": myResults,
                "error": False,
                "message": "Albumes obtenidos correctamente"
                }), 200
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Albumes no encontrados"
            }), 400  
            
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Albumes no encontrados"
            }), 400

@app.route('/foto/subirFoto', methods=['POST']) 
@cross_origin(supports_credentials=True)
def subirFoto():
    
    try:
        #leyendo json
        respuesta = request.get_json()
        idAlbum=respuesta['idAlbum']
        nombre=respuesta['nombre']
        imageStr = respuesta['linkFoto']
    
        #creamos su idUnico
        idUnico=str(uuid.uuid4())

        #convierto a b64
        imageb64 = base64.b64decode(imageStr)

        #parametros S3
        paramS3 = {
            'ContentType':'image/jpg'
        }
        dirURL ='http://' + BUCKET_NAME + '.s3.' + AWS_REGION + '.amazonaws.com/Fotos_Publicadas/'+idUnico+'.jpg'
        pathFoto="Fotos_Publicadas/"+idUnico+'.jpg'
        nbucket = s3.Bucket('semi1practica1')
        nbucket.upload_fileobj(io.BytesIO(imageb64),pathFoto,paramS3)

        mycursor = mydb.cursor()
        sql = "INSERT INTO semi1practica1.Fotos (nombre, link, idAlbum) VALUES (%s, %s, %s)"
        val = (nombre, dirURL, idAlbum)
        mycursor.execute(sql, val)
        mydb.commit()

        return jsonify({
            "result": True,
            "error": False,
            "message": "Foto registrada correctamente"
            }), 201 
    except:
        return jsonify({
            "result": False,
            "error": True,
            "message": "Error al registrar nueva foto"
            }), 400

@app.route('/foto/getFotos/<idAlbum>', methods=['GET']) 
@cross_origin(supports_credentials=True)
def getFotosByAlbum(idAlbum):
    
    try:
        #leyendo json
        mycursor = mydb.cursor()
        sql = "SELECT * FROM semi1practica1.Fotos WHERE idAlbum = " + idAlbum
        mycursor.execute(sql)
        selectedFotos = mycursor.fetchall()
        
        if selectedFotos:
            
            myResults = []          
            for x in selectedFotos:
                fotoInfo = {
                    "idFoto": x[0],
                    "nombre": x[1],
                    "link": x[2]
                }                
                myResults.append(fotoInfo)
            
            return jsonify({
                "result": myResults,
                "error": False,
                "message": "Fotos obtenidas correctamente"
                }), 200
        else:
            return jsonify({
            "result": "",
            "error": True,
            "message": "Fotos no encontradas"
            }), 400  
            
    except:
        return jsonify({
            "result": "",
            "error": True,
            "message": "Fotos no encontradas"
            }), 400


# Fin ----
if __name__ == '__main__':
    app.run(port=3006, debug=True)