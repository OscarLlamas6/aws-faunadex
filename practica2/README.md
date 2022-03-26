### Seminario de Sistemas 1
### Practica 1

# Manual de Configuración

## Datos Estudiantes
| Nombre | Carné |
| ------ | ------ |
| Carlos Raúl Campos Meléndez | 201800639 |
| José Alejandro Santizo Cotto | 201709309|
| Sergio Sebastian Chacón Herrera | 201709159 |
| Oscar Alfredo Llamas Lemus  | 201602625 |

## Descripción de la arquitectura utilizada

### Página web

Se realizó el frontend de la aplicación con REACT subida en un bucket de S3 público

### Servers

Se realizaron 2 servidores con las mismas funciones, montados en instancias EC2 con un Segurity group configurado únicamente para el puerto utilizado.

### Bucket imágenes

Se configuró un bucket en S3 para el alojamiento de las imágenes de manera pública para poder acceder a ellas a través de la página web.

### Base de datos

Se trabajó con MySql almacenada en una instancia RDS.

## Usuarios IAM utilizados y políticas

### EC2

Para el trabajo con los buckets EC2 se creó el usuario User_EC2 con la política AmazonEC2FullAccess

### S3

Para el trabajo con el bucket S3 se creó el usuario User_S3 con la política AmazonS3FullAccess

### RDS

Para el trabajo con la instancia RDS se creó el usuario User_RDS con la política AmazonRDSFullAccess

### ChatBot

Para el trabajo con el chat bot se creó el usuario User_ChatBot con la política AmazonLexFullAccess

### Rekognition

Para el trabajo con Rekognition  se creó el usuario User_Rekognition con las políticas AmazonS3FullAccess y AmazonRekognitionFullAccess

### Translate

Para el trabajo con Translate  se creó el usuario User_Translate con las políticas TranslateFullAccess y AmazonCognitoDeveloperAuthenticatedIdentities