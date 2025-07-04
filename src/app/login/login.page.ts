import { AuthService } from './../servicios/auth.service';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, IonText,
  IonButton, IonIcon, IonCheckbox, IonItem, IonInput, IonCardContent,
  IonCard, IonAvatar, IonSpinner
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { IuserLogin } from '../interface/IUser';
interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonLabel, IonSpinner, IonAvatar, IonCard, IonCardContent,
    IonInput, IonItem, IonCheckbox, IonIcon, IonButton, IonText,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule
  ]
})
export class LoginPage implements OnInit {

private authservice = inject(AuthService);
private router= inject(Router);
private LoadingController = inject(LoadingController);
private alertController = inject(AlertController);
private toastController = inject(ToastController);

  // Variable para el loading
loading: any;
  // Datos del formulario
  loginData: LoginData = {
    email: '',
    password: ''
  };

  // Estados del componente
  showPassword: boolean = false;
  rememberMe: boolean = false;
  isLoading: boolean = false;

  // Estados adicionales para la nueva UI
  emailFocused: boolean = false;
  passwordFocused: boolean = false;
  isFormValid: boolean = false;

  constructor(
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    // Verificar si hay datos guardados
    this.loadSavedCredentials();
    // Validar formulario inicial
    this.validateForm();
  }

  async login() {
    this.showLoading();
    this.authservice.login(this.loginData.email,this.loginData.password).subscribe({
      next: (response: IuserLogin) => {
       // console.log('Login exitoso:', response);
       localStorage.setItem('user', response.dataUser.user);
       localStorage.setItem('token', response.token);
       localStorage.setItem('id', response.dataUser.id.toString());
        // Redirigir al usuario a la página de búsqueda
        this.router.navigate(['/tabs/search']);
        this.loading.dismiss();
        this.presentToast();
      }
      ,
      error: (error) => {
      this.loading.dismiss();
      this.presentAlert(error.error.message);
        console.error('Error en el login:', error);
      }
    });
  }

  async showLoading() {
     this.loading = await this.LoadingController.create({
      message: 'iniciando sesion.....',
      spinner: 'crescent',
    });

    this.loading.present();
  }

  async presentAlert(message: string ) {
    const alert = await this.alertController.create({
      header: 'Mensaje',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Bienvenidos a Movies Dilan',
      duration: 2500,
      position: 'middle',
    });

    await toast.present();
  }

  /**
   * Manejar focus en campos de entrada
   */
  onEmailFocus(): void {
    this.emailFocused = true;
  }

  onEmailBlur(): void {
    this.emailFocused = false;
    this.validateForm();
  }

  onPasswordFocus(): void {
    this.passwordFocused = true;
  }

  onPasswordBlur(): void {
    this.passwordFocused = false;
    this.validateForm();
  }

  /**
   * Manejar cambios en los campos
   */
  onEmailChange(): void {
    this.validateForm();
  }

  onPasswordChange(): void {
    this.validateForm();
  }

  /**
   * Validar formulario completo
   */
  private validateForm(): void {
    this.isFormValid = this.isValidEmail(this.loginData.email) &&
                      this.loginData.password.length >= 6;
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Manejar cambio en checkbox "recordarme"
   */
  onRememberMeChange(): void {
    // Lógica adicional si es necesaria
  }

  /**
   * Manejar el envío del formulario de login
   */
  async onLogin(): Promise<void> {
    if (this.isLoading || !this.isFormValid) return;

    this.isLoading = true;

    // Crear loading con diseño personalizado
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'circular',
      cssClass: 'custom-loading'
    });

    await loading.present();

    try {
      // Simular llamada a API
      await this.simulateLogin();

      // Guardar credenciales si está marcado "recordarme"
      if (this.rememberMe) {
        this.saveCredentials();
      } else {
        this.clearSavedCredentials();
      }

      await loading.dismiss();

      // Mostrar mensaje de éxito
      await this.showSuccessToast('¡Bienvenido! Sesión iniciada correctamente');

      // Navegar a la página principal con animación
      await this.router.navigate(['/home'], {
        replaceUrl: true,
        state: { animationType: 'slide-in' }
      });

    } catch (error) {
      await loading.dismiss();

      // Manejar errores con mejor UX
      await this.showErrorAlert(
        'Error de autenticación',
        'Credenciales incorrectas. Por favor verifica tu email y contraseña.',
        'Intentar de nuevo'
      );

      // Limpiar contraseña en caso de error
      this.loginData.password = '';
      this.validateForm();

    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Manejar olvido de contraseña con mejor UX
   */
  async onForgotPassword(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Recuperar Contraseña',
      message: 'Te enviaremos un enlace para restablecer tu contraseña.',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Ingresa tu correo electrónico',
          value: this.loginData.email,
          attributes: {
            autocomplete: 'email'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel'
        },
        {
          text: 'Enviar enlace',
          cssClass: 'alert-button-confirm',
          handler: async (data) => {
            if (data.email && this.isValidEmail(data.email)) {
              await this.sendPasswordReset(data.email);
              return true;
            } else {
              await this.showErrorAlert(
                'Email inválido',
                'Por favor ingresa un correo electrónico válido',
                'Entendido'
              );
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Manejar login con Google
   */
  async onGoogleLogin(): Promise<void> {
    if (this.isLoading) return;

    const loading = await this.loadingController.create({
      message: 'Conectando con Google...',
      spinner: 'dots',
      cssClass: 'social-loading'
    });

    await loading.present();

    try {
      // Aquí implementarías la lógica de Google OAuth
      await this.simulateSocialLogin('Google');

      await loading.dismiss();
      await this.showSuccessToast('¡Conectado con Google exitosamente!');

      // Navegar a home
      await this.router.navigate(['/home'], {
        replaceUrl: true,
        state: { loginMethod: 'google' }
      });

    } catch (error) {
      await loading.dismiss();
      await this.showErrorAlert(
        'Error de conexión',
        'No se pudo conectar con Google. Inténtalo de nuevo.',
        'Reintentar'
      );
    }
  }

  /**
   * Manejar login con Facebook
   */
  async onFacebookLogin(): Promise<void> {
    if (this.isLoading) return;

    const loading = await this.loadingController.create({
      message: 'Conectando con Facebook...',
      spinner: 'dots',
      cssClass: 'social-loading'
    });

    await loading.present();

    try {
      // Aquí implementarías la lógica de Facebook OAuth
      await this.simulateSocialLogin('Facebook');

      await loading.dismiss();
      await this.showSuccessToast('¡Conectado con Facebook exitosamente!');

      // Navegar a home
      await this.router.navigate(['/home'], {
        replaceUrl: true,
        state: { loginMethod: 'facebook' }
      });

    } catch (error) {
      await loading.dismiss();
      await this.showErrorAlert(
        'Error de conexión',
        'No se pudo conectar con Facebook. Inténtalo de nuevo.',
        'Reintentar'
      );
    }
  }

  /**
   * Navegar a página de registro
   */
  async onRegister(): Promise<void> {
    await this.router.navigate(['/register'], {
      state: {
        email: this.loginData.email,
        animationType: 'slide-up'
      }
    });
  }

  /**
   * Simular llamada a API de login
   */
  private async simulateLogin(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular validación más realista
        if (this.isValidEmail(this.loginData.email) && this.loginData.password.length >= 6) {
          // Credenciales de prueba expandidas
          const validCredentials = [
            { email: 'admin@test.com', password: '123456' },
            { email: 'user@example.com', password: 'password' },
            { email: 'demo@cinema.com', password: 'demo123' }
          ];

          const isValid = validCredentials.some(cred =>
            cred.email === this.loginData.email && cred.password === this.loginData.password
          );

          if (isValid) {
            resolve();
          } else {
            reject(new Error('Invalid credentials'));
          }
        } else {
          reject(new Error('Invalid format'));
        }
      }, 1500);
    });
  }

  /**
   * Simular login social
   */
  private async simulateSocialLogin(provider: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular éxito con probabilidad del 90%
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error(`${provider} login failed`));
        }
      }, 2000);
    });
  }

  /**
   * Enviar recuperación de contraseña
   */
  private async sendPasswordReset(email: string): Promise<void> {
    const loading = await this.loadingController.create({
      message: 'Enviando enlace de recuperación...',
      spinner: 'circular'
    });

    await loading.present();

    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      await loading.dismiss();
      await this.showSuccessToast(
        `📧 Enlace de recuperación enviado a ${email}`
      );

    } catch (error) {
      await loading.dismiss();
      await this.showErrorAlert(
        'Error de envío',
        'No se pudo enviar el enlace. Verifica tu conexión.',
        'Reintentar'
      );
    }
  }

  /**
   * Guardar credenciales en localStorage (solo en navegador)
   */
  private saveCredentials(): void {
    try {
      if (typeof Storage !== 'undefined') {
        const credentials = {
          email: this.loginData.email,
          rememberMe: true,
          timestamp: Date.now()
        };
        localStorage.setItem('loginCredentials', JSON.stringify(credentials));
      }
    } catch (error) {
      console.warn('No se pudieron guardar las credenciales:', error);
    }
  }

  /**
   * Cargar credenciales guardadas
   */
  private loadSavedCredentials(): void {
    try {
      if (typeof Storage !== 'undefined') {
        const saved = localStorage.getItem('loginCredentials');
        if (saved) {
          const credentials = JSON.parse(saved);
          // Verificar que no sean muy antiguas (30 días)
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

          if (credentials.timestamp && credentials.timestamp > thirtyDaysAgo) {
            this.loginData.email = credentials.email || '';
            this.rememberMe = credentials.rememberMe || false;
          } else {
            // Limpiar credenciales antiguas
            this.clearSavedCredentials();
          }
        }
      }
    } catch (error) {
      console.warn('No se pudieron cargar las credenciales:', error);
    }
  }

  /**
   * Limpiar credenciales guardadas
   */
  private clearSavedCredentials(): void {
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('loginCredentials');
      }
    } catch (error) {
      console.warn('No se pudieron limpiar las credenciales:', error);
    }
  }

  /**
   * Validar formato de email mejorado
   */
  private isValidEmail(email: string): boolean {
    if (!email || email.trim().length === 0) return false;

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Mostrar toast de éxito con mejor diseño
   */
  private async showSuccessToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
      cssClass: 'success-toast',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }

  /**
   * Mostrar alerta de error mejorada
   */
  private async showErrorAlert(header: string, message: string, buttonText: string = 'OK'): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      cssClass: 'error-alert',
      buttons: [
        {
          text: buttonText,
          cssClass: 'alert-button-confirm'
        }
      ]
    });
    await alert.present();
  }

  /**
   * Obtener clase CSS dinámica para el botón de login
   */
  getLoginButtonClass(): string {
    return this.isFormValid ? 'login-button-active' : 'login-button-disabled';
  }

  /**
   * Obtener clase CSS para campos de entrada
   */
  getInputClass(field: 'email' | 'password'): string {
    const isFocused = field === 'email' ? this.emailFocused : this.passwordFocused;
    const hasValue = field === 'email' ?
      this.loginData.email.length > 0 :
      this.loginData.password.length > 0;

    let classes = 'custom-input';
    if (isFocused) classes += ' input-focused';
    if (hasValue) classes += ' input-has-value';

    return classes;
  }
}
