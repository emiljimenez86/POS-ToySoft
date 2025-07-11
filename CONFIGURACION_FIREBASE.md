# 🔥 Configuración Completa de Firebase con Google Auth

## 🚀 Paso a Paso para Configurar Firebase

### 1. Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Crear un proyecto"**
3. Nombre del proyecto: `toysoft-free`
4. **Desactivar** Google Analytics (opcional)
5. Haz clic en **"Crear proyecto"**

### 2. Habilitar Authentication

1. En el panel izquierdo, haz clic en **"Authentication"**
2. Haz clic en **"Comenzar"**
3. Ve a la pestaña **"Sign-in method"**
4. Habilita **"Email/Password"**:
   - Marca la casilla
   - Haz clic en **"Guardar"**
5. Habilita **"Google"**:
   - Marca la casilla
   - Selecciona un **"Correo electrónico de soporte"** (tu email)
   - Haz clic en **"Guardar"**

### 3. Habilitar Firestore Database

1. En el panel izquierdo, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"**
3. Selecciona **"Comenzar en modo de prueba"**
4. Elige una ubicación: **"us-central1 (Iowa)"**
5. Haz clic en **"Siguiente"** y luego **"Habilitar"**

### 4. Obtener Configuración

1. Haz clic en el **ícono de engranaje** (⚙️) junto a "Vista general del proyecto"
2. Selecciona **"Configuración del proyecto"**
3. Ve a la pestaña **"Tus apps"**
4. Haz clic en el ícono **web** (</>)
5. Dale un nombre: **"ToySoft Free Web"**
6. **NO** marques "También configurar Firebase Hosting"
7. Haz clic en **"Registrar app"**
8. Copia la configuración que aparece

### 5. Configurar Dominios Autorizados

1. En **Authentication** → **Settings** → **Authorized domains**
2. Agrega tu dominio (si tienes uno) o deja solo `localhost`

### 6. Configurar Reglas de Firestore

1. Ve a **Firestore Database** → **Rules**
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios solo pueden acceder a sus propios datos
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Haz clic en **"Publicar"**

## 🔧 Verificar Configuración

### 1. Abrir la Consola del Navegador

1. Abre tu proyecto en el navegador
2. Presiona **F12** para abrir las herramientas de desarrollador
3. Ve a la pestaña **"Console"**

### 2. Verificar Mensajes

Deberías ver estos mensajes en la consola:
```
Firebase configurado correctamente
Creando Firebase Auth Manager...
Inicializando Firebase Auth Manager...
Inicializando estado de la página...
```

### 3. Probar Autenticación

1. Haz clic en **"Continuar con Google"**
2. Selecciona tu cuenta de Google
3. Deberías ver: `Login con Google exitoso: tu-email@gmail.com`

## 🚨 Solución de Problemas Comunes

### Error: "Firebase App named '[DEFAULT]' already exists"

**Solución**: Este error es normal si Firebase ya está inicializado. No afecta la funcionalidad.

### Error: "popup_closed_by_user"

**Solución**: El usuario cerró la ventana de Google. Intenta de nuevo.

### Error: "auth/unauthorized-domain"

**Solución**: 
1. Ve a Firebase Console → Authentication → Settings
2. En "Authorized domains", agrega tu dominio
3. Si estás en localhost, agrega `localhost`

### Error: "auth/popup-blocked"

**Solución**: 
1. Permite popups en tu navegador
2. O usa `signInWithRedirect` en lugar de `signInWithPopup`

### Error: "firebase/firestore/permission-denied"

**Solución**: 
1. Verifica que las reglas de Firestore estén configuradas correctamente
2. Asegúrate de que el usuario esté autenticado

## 📱 Probar Funcionalidad

### 1. Registro con Email
1. Haz clic en **"Crear Cuenta"**
2. Completa el formulario
3. Verifica que se cree la cuenta

### 2. Login con Email
1. Usa las credenciales creadas
2. Verifica que inicie sesión correctamente

### 3. Login con Google
1. Haz clic en **"Continuar con Google"**
2. Selecciona tu cuenta
3. Verifica que inicie sesión

### 4. Cerrar Sesión
1. Haz clic en **"Cerrar Sesión"**
2. Verifica que regrese al login

## 🔍 Verificar en Firebase Console

### 1. Usuarios Registrados
1. Ve a **Authentication** → **Users**
2. Deberías ver los usuarios registrados

### 2. Datos en Firestore
1. Ve a **Firestore Database** → **Data**
2. Deberías ver la colección `users` con los datos

## 📞 Soporte

Si tienes problemas:
- **WhatsApp**: +57 319 236 4724
- **Email**: [Tu email]
- **Documentación**: [Firebase Docs](https://firebase.google.com/docs)

---

**¡Configuración completada! 🎉** 