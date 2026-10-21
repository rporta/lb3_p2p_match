# Ajustes p2p:

X - al llamar no se efectua la llamada, no sale el audio. video llamada anda de lujo 
X - chat multimedia (texto, audio, imagen, video, emojis)
X - Cuando se inicia un chat multimedia, deseo que el receptor no entre en foco con esa solicitud de chat, porque si estaba en conversacion con otro usuario lo saca de foco, tratemos que no le quite el foco al receptor, y ademas en la lista de conectados, si es posible al enviar un mensaje a alguien que en la lista de conectados indique si hay un mensaje nuevo de ese contacto.

# Etapa 1 

- En newUser, agregar el paso de locacion. agregar la parte de carga de genero, agregar la parte de carga de descripcion; 
paso opcional agregar imagenes 5.

- Desacoplar el modal de locacion de userPage.vue

- userPage.vue que el tab button este en storage, ejecutar

- que la card salga en pantalla completa 

- /profile-settings -> Editar información personal vamos a crear una nueva pantalla, que atienda esto, y ademas administre las fotos y los videos.

- /profile-settings -> En el avatar, en una ezquina meter un icono de lapiz, para editar avatar, si se toca sale modal para editar avatar como en (SUB-VIEW 3: Foto de Perfil)

- /profile-settings -> agregar el seteo del estado conectado o desconectado.

- /profile-settings -> configuracion de filtros de pareja seccion nueva: aqui filtramos por rango de edad, por sexo.

- /concurrent-user (3) -> cada lista, en la parte superior izquierda, van a tener 3 botones verticales, sera un boton que desplega opciones(un boton para bloquear y un boton para eliminar match); Si la persona esta revelada y conectada, y se le da click va directo a ventana de chat. sino no hace nada.

- /concurrent-user (3, 4) -> el avatar en estado desconectado, tendra un circulo en una ezquina del circulo del avatar, que prende rojo para estado desconectado y verde para conectado. Si esta en verde y se le da click va directo a ventana de chat. sino no hace nada.

# Etapa 2

homePage, que efectue todo lo que es p2p, se va a integrar en main y que tenga vida.

# Etapa 3 

Inyeccion de promociones p2p, lb tendra endpoint, para cargar promos que las notificada a todos los usuarios. o parte de usuarios

Se definira el objeto promosion, y habra una tienda. para comprar

# API de notificaciones

# modal pantalla completa mostrando carrousel de packs de ofertas para vender, que se comunica via api, y dispara un evento por socket 


# Etapa 4 ver de pensar integrar publicidad


