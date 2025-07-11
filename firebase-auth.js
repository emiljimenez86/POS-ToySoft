// Firebase Authentication Manager
class FirebaseAuthManager {
    constructor() {
        console.log('Constructor Firebase Auth Manager iniciado...');
        
        // Verificar que Firebase esté disponible
        if (!window.auth || !window.db) {
            console.error('Firebase no está disponible. Esperando...');
            setTimeout(() => {
                if (window.auth && window.db) {
                    this.initialize();
                } else {
                    console.error('Firebase no se pudo cargar');
                }
            }, 1000);
            return;
        }
        
        this.initialize();
    }

    initialize() {
        console.log('Inicializando Firebase Auth Manager...');
        
        this.auth = window.auth;
        this.db = window.db;
        this.googleProvider = window.googleProvider;
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('Inicializando Firebase Auth Manager...');
        
        // Escuchar cambios en el estado de autenticación
        window.firebaseAuth.onAuthStateChanged(this.auth, (user) => {
            console.log('Estado de autenticación cambiado:', user ? 'Usuario logueado' : 'Usuario no logueado');
            if (user) {
                this.currentUser = user;
                this.onUserLogin(user);
            } else {
                this.currentUser = null;
                this.onUserLogout();
            }
        });
        
        // Asegurar que la página se muestre correctamente
        this.initializePageState();
    }

    // Inicializar el estado de la página
    initializePageState() {
        console.log('Inicializando estado de la página...');
        // Asegurar que el body esté visible
        if (document.body) {
            document.body.style.display = 'block';
        }
        
        // Si no hay usuario autenticado, mostrar login
        if (!this.currentUser) {
            if (document.getElementById('loginSection')) {
                document.getElementById('loginSection').style.display = 'block';
            }
            if (document.getElementById('appSection')) {
                document.getElementById('appSection').style.display = 'none';
            }
        }
    }

    // Inicio de sesión con Google
    async loginWithGoogle() {
        try {
            console.log('=== FIREBASE AUTH MANAGER: LOGIN GOOGLE ===');
            console.log('1. Verificando auth y googleProvider...');
            
            if (!this.auth) {
                console.log('❌ this.auth no está disponible');
                return { success: false, error: 'Auth no disponible' };
            }
            
            if (!this.googleProvider) {
                console.log('❌ this.googleProvider no está disponible');
                return { success: false, error: 'Google Provider no disponible' };
            }
            
            console.log('✅ Auth y GoogleProvider disponibles');
            console.log('2. Verificando signInWithPopup...');
            
            if (!window.firebaseAuth.signInWithPopup) {
                console.log('❌ signInWithPopup no está disponible');
                return { success: false, error: 'signInWithPopup no disponible' };
            }
            
            console.log('✅ signInWithPopup disponible');
            console.log('3. Iniciando popup de Google...');
            
            const result = await window.firebaseAuth.signInWithPopup(this.auth, this.googleProvider);
            const user = result.user;
            
            console.log('4. Usuario obtenido:', user.email);
            console.log('5. Guardando datos en Firestore...');
            
            // Guardar datos del usuario de Google en Firestore
            await this.saveUserData(user.uid, {
                email: user.email,
                displayName: user.displayName || 'Usuario Google',
                photoURL: user.photoURL,
                provider: 'google',
                role: 'user',
                createdAt: new Date().toISOString()
            });
            
            console.log('✅ Login con Google exitoso:', user.email);
            return { success: true, user };
        } catch (error) {
            console.log('❌ Error en loginWithGoogle:', error);
            console.error('Error completo:', error);
            return { success: false, error: error.message };
        }
    }

    // Registro de usuario
    async registerUser(email, password, userData = {}) {
        try {
            console.log('Registrando usuario:', email);
            const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Guardar datos adicionales del usuario en Firestore
            await this.saveUserData(user.uid, {
                email: user.email,
                displayName: userData.displayName || '',
                role: userData.role || 'user',
                provider: 'email',
                createdAt: new Date().toISOString(),
                ...userData
            });

            console.log('Usuario registrado exitosamente:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return { success: false, error: error.message };
        }
    }

    // Inicio de sesión
    async loginUser(email, password) {
        try {
            console.log('Iniciando sesión:', email);
            const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            
            // Cargar datos del usuario desde Firestore
            await this.loadUserData(user.uid);
            
            console.log('Login exitoso:', user.email);
            return { success: true, user };
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    async logoutUser() {
        try {
            console.log('Cerrando sesión...');
            await window.firebaseAuth.signOut(this.auth);
            console.log('Sesión cerrada exitosamente');
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return { success: false, error: error.message };
        }
    }

    // Guardar datos del usuario en Firestore
    async saveUserData(userId, userData) {
        try {
            const userRef = window.firebaseFirestore.doc(this.db, 'users', userId);
            await window.firebaseFirestore.setDoc(userRef, userData);
            console.log('Datos del usuario guardados en Firestore');
        } catch (error) {
            console.error('Error al guardar datos del usuario:', error);
        }
    }

    // Cargar datos del usuario desde Firestore
    async loadUserData(userId) {
        try {
            const userRef = window.firebaseFirestore.doc(this.db, 'users', userId);
            const userSnap = await window.firebaseFirestore.getDoc(userRef);
            
            if (userSnap.exists()) {
                const userData = userSnap.data();
                // Guardar en localStorage para compatibilidad
                localStorage.setItem('userData', JSON.stringify(userData));
                console.log('Datos del usuario cargados desde Firestore');
                return userData;
            }
        } catch (error) {
            console.error('Error al cargar datos del usuario:', error);
        }
        return null;
    }

    // Sincronizar datos locales con Firestore
    async syncLocalDataToFirestore() {
        if (!this.currentUser) return;

        try {
            // Sincronizar productos
            const productos = JSON.parse(localStorage.getItem('productos') || '[]');
            if (productos.length > 0) {
                await this.saveUserData(this.currentUser.uid, {
                    productos: productos,
                    lastSync: new Date().toISOString()
                });
            }

            // Sincronizar categorías
            const categorias = JSON.parse(localStorage.getItem('categorias') || '[]');
            if (categorias.length > 0) {
                await this.saveUserData(this.currentUser.uid, {
                    categorias: categorias,
                    lastSync: new Date().toISOString()
                });
            }

            // Sincronizar historial de ventas
            const historialVentas = JSON.parse(localStorage.getItem('historialVentas') || '[]');
            if (historialVentas.length > 0) {
                await this.saveUserData(this.currentUser.uid, {
                    historialVentas: historialVentas,
                    lastSync: new Date().toISOString()
                });
            }

            console.log('Datos locales sincronizados con Firestore');
        } catch (error) {
            console.error('Error al sincronizar datos:', error);
        }
    }

    // Cargar datos desde Firestore al localStorage
    async loadDataFromFirestore() {
        if (!this.currentUser) return;

        try {
            const userData = await this.loadUserData(this.currentUser.uid);
            if (userData) {
                // Restaurar datos en localStorage
                if (userData.productos) {
                    localStorage.setItem('productos', JSON.stringify(userData.productos));
                }
                if (userData.categorias) {
                    localStorage.setItem('categorias', JSON.stringify(userData.categorias));
                }
                if (userData.historialVentas) {
                    localStorage.setItem('historialVentas', JSON.stringify(userData.historialVentas));
                }
                console.log('Datos cargados desde Firestore al localStorage');
            }
        } catch (error) {
            console.error('Error al cargar datos desde Firestore:', error);
        }
    }

    // Callback cuando el usuario inicia sesión
    onUserLogin(user) {
        console.log('Usuario autenticado:', user.email);
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        
        // Cargar datos del usuario
        this.loadDataFromFirestore();
        
        // Mostrar sección de la aplicación
        if (document.getElementById('loginSection')) {
            document.getElementById('loginSection').style.display = 'none';
        }
        if (document.getElementById('appSection')) {
            document.getElementById('appSection').style.display = 'block';
        }
    }

    // Callback cuando el usuario cierra sesión
    onUserLogout() {
        console.log('Usuario cerró sesión');
        localStorage.removeItem('sesionActiva');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userData');
        
        // Mostrar sección de login
        if (document.getElementById('appSection')) {
            document.getElementById('appSection').style.display = 'none';
        }
        if (document.getElementById('loginSection')) {
            document.getElementById('loginSection').style.display = 'block';
        }
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
}

// Inicializar el manager de autenticación
console.log('Creando Firebase Auth Manager...');

// Función para inicializar cuando Firebase esté listo
function initializeFirebaseAuth() {
    if (window.auth && window.db) {
        console.log('Firebase está listo, creando Auth Manager...');
        window.firebaseAuthManager = new FirebaseAuthManager();
    } else {
        console.log('Firebase no está listo, esperando...');
        setTimeout(initializeFirebaseAuth, 500);
    }
}

// Iniciar el proceso de inicialización
initializeFirebaseAuth(); 