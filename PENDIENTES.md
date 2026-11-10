# Ajustes p2p:

X - al llamar no se efectua la llamada, no sale el audio. video llamada anda de lujo 
X - chat multimedia (texto, audio, imagen, video, emojis)
X - Cuando se inicia un chat multimedia, deseo que el receptor no entre en foco con esa solicitud de chat, porque si estaba en conversacion con otro usuario lo saca de foco, tratemos que no le quite el foco al receptor, y ademas en la lista de conectados, si es posible al enviar un mensaje a alguien que en la lista de conectados indique si hay un mensaje nuevo de ese contacto.

# Entre etapa

## setear estado: conectado | desconectado

- /profile-settings un menu rapido para setear en storage, conectado o desconectado, 

- /profile-settings en el avatar, agregar un borde rojo desconectado, verde conectado.

## conectar con store de corazon

- /concurrent-user->encountersPage, si ya no hay mas corazon disponible en store, hacer animacion moviendo la carta como si fuera un No, y no restar corazones
- /concurrent-user->encountersPage, Si no hay mas matches disponibles, mostrar

## Crear nueva ruta (/match-profile)

- /concurrent-user->matchGrid: Al tocar una card abre en /match-profile 
- /concurrent-user->encountersPage: Al tocar una card abre en /match-profile 
- /concurrent-user->likesPage: En un item enfocado al tocar, abre en /match-profile

## conectar con store de ojos

- /concurrent-user->likesPage, Si hay contador de ojos, y el item match no esta completo, entonces a ese item desenfocar la imagen del avatar,

- /concurrent-user->likesPage, En un item desenfocado, al tocar levantar un modal, preguntando 'quieres revelar el match?' opciones (si, no) 

    - Si toca Si: quita el desenfocado para ese item, descuenta el contador, solo cierra el modal
    - Si toca No: solo cierra el modal

- /concurrent-user->likesPage: En un item enfocado, en la punta del item, 3 botones verticales, sera un boton que desplega opciones(un boton para (bloquear|desbloquear) y un boton para eliminar match);  
    
    boton para eliminar match: 
        - Si toca Si: elimina el match, solo cierra el modal
        - Si toca No: solo cierra el modal

- /concurrent-user->likesPage: Si la persona esta revelada y conectada, y se le da click va directo a ventana de chat. sino no hace nada.

## chatPage

- /concurrent-user->chatPage: En la punta del item, 3 botones verticales sera un boton que desplega opciones(
    - ver perfil -> match-profile
    - eliminar conversacion: sale modal preguntando 'quieres eliminar la conversacion ?' opciones (si, no) 
)

- /concurrent-user->chatPage: En el item, al tocar abre una nueva ruta 'userPage/conversation.vue' donde se genera todo lo de /homePage

- /concurrent-user->chatPage: en la esquina inferior derecha, agregar un fab(+), que al tocar, chatPage, pasa a contactPage 

## userPage/contactLikePage.vue

    - titulo: Tus likes conectados
    - sub titulo: Chatea con ellos

Lista de likes conectados: [
    {
        head: avatar | nombre | alias | last time mensaje
        footer: ultimo mensaje
    }
]

Al tocar un contacto va a nueva ruta (userPage/conversation.vue)

### Store

X - crear un store (socialStore), para administrar: 
    - conversation[uuid] // Para listar las conversaciones existentes
    - likes[uuid] // Para listar los likes (p2p que me dieron me gusta pero yo no )
    - matchs[uuid] // Para listar los matches (p2p que ambas partes nos dimos me gusta)
    - matchsOnline [uuid] // Para listar los likes conectados 
    - matchsBlocked [uuid] // Para filtrar los matches (p2p que ambas partes nos dimos me gusta)

# Etapa 1 

X - En newUser. Agregar la parte de carga de genero, agregar la parte de carga de descripcion; 
paso opcional agregar imagenes 5.

- Desacoplar el modal de locacion de userPage.vue

- userPage.vue que el tab button este en storage, ejecutar

- que la card salga en pantalla completa 

X - /profile-settings -> Editar información personal vamos a crear una nueva pantalla, que atienda esto, y ademas administre las fotos y los videos.

X - /profile-settings -> En el avatar, en una ezquina meter un icono de lapiz, para editar avatar, si se toca sale modal para editar avatar como en (SUB-VIEW 3: Foto de Perfil)

- /profile-settings -> agregar el seteo del estado conectado o desconectado.

? - /profile-settings -> configuracion de filtros de pareja seccion nueva: aqui filtramos por rango de edad, por sexo.

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
