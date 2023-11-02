import { Component, OnInit } from '@angular/core';
import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-registro-clase',
  templateUrl: './registro-clase.page.html',
  styleUrls: ['./registro-clase.page.scss'],
})
export class RegistroClasePage implements OnInit {
  mensajeDesdePreferences: string | null = '';
  latitude: number | undefined;
  longitude: number | undefined;
  horaDesdePreferences: string | null = '';
  usuarios: any[] = [];
  imageSrc: string = '';


  usuarioSesion: any; // Para almacenar los datos del usuario que ha iniciado sesión
  fotoTomada: boolean = false; // Variable para verificar si se ha tomado una foto
  constructor(private router: Router,private alertController: AlertController) { }

  ngOnInit() {
    this.getCurrentPosition();
    this.retrieveMessageFromPreferences();
    this.retrieveUsuariosFromPreferences();
    this.retrieveHoraFromPreferences();
    this.retrieveUsuarioSesion(); // Agrega esta línea

  }

  async getCurrentPosition() {
    try {
      const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
    } catch (error) {
      console.error('Error al obtener la posición actual:', error);
    }
  }

  async abrirCamara() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
      });

      if (image && image.webPath) {
        this.imageSrc = image.webPath;
        this.fotoTomada = true; // Marca la foto como tomada
      } else {
        console.log('No se capturó ninguna imagen o la imagen es nula.');
      }
    } catch (error) {
      console.error('Error al abrir la cámara:', error);
    }
  }

  async retrieveMessageFromPreferences() {
    try {
      const mensaje = await Preferences.get({ key: 'mensaje' });
      if (mensaje && mensaje.value) {
        this.mensajeDesdePreferences = this.agregarSaltosDeLinea(mensaje.value);
        console.log('ahora si ', mensaje);
      }
    } catch (error) {
      console.error('Error al recuperar el mensaje desde Preferences:', error);
    }
  }

  async retrieveUsuariosFromPreferences() {
    try {
      const usuariosJSON = await Preferences.get({ key: 'usuarios' });
      if (usuariosJSON && usuariosJSON.value) {
        this.usuarios = JSON.parse(usuariosJSON.value);
      }
    } catch (error) {
      console.error('Error al recuperar usuarios desde Preferences:', error);
    }
  }

  





  async retrieveUsuarioSesion() {
    try {
      const usuarioJSON = await Preferences.get({ key: 'usuario' });
      if (usuarioJSON && usuarioJSON.value) {
        this.usuarioSesion = JSON.parse(usuarioJSON.value);
      }
    } catch (error) {
      console.error('Error al recuperar el usuario de la sesión desde Preferences:', error);
    }
  }

  async registrarClase() {
    if (this.fotoTomada) {
      // Realiza el proceso de registro de la clase aquí
      // Puedes agregar tu lógica para el registro de la clase
      // Si todo va bien, muestra un mensaje de éxito
      const alert = await this.alertController.create({
        header: 'Registro exitoso',
        message: 'La clase ha sido registrada correctamente.',
        buttons: ['Aceptar']
      });

      await alert.present();
    } else {
      // Muestra una alerta si no se ha tomado una foto
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes tomar una foto antes de registrar la clase.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
}





  async retrieveHoraFromPreferences() {
    try {
      const hora = await Preferences.get({ key: 'hora' });
      if (hora && hora.value) {
        this.horaDesdePreferences = hora.value;
      }
    } catch (error) {
      console.error('Error al recuperar la hora desde Preferences:', error);
    }
  }

  agregarSaltosDeLinea(mensaje: string) {
    return mensaje.replace(/,/g, '<br>');
  }

  async cerrarSesion() {
    // Elimina los datos relacionados con la sesión actual del LocalStorage
    await Preferences.remove({ key: 'nombreUsuario' });
    await Preferences.remove({ key: 'usuario' });

    // Elimina los datos relacionados con mensaje y hora
    await Preferences.remove({ key: 'mensaje' });
    await Preferences.remove({ key: 'hora' });

    // Limpia la imagen
    this.imageSrc = ''; // Establece la imagen en blanco
    this.fotoTomada=false;
    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige al usuario a la página de inicio de sesión
  }
}
