import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../servicios/auth.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';
import { IonHeader, IonSpinner, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';  // <-- Importar CommonModule

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    CommonModule,  // <-- Agregado aquí
    ReactiveFormsModule,
    IonButton,
    IonInput,
    IonItem,
    IonContent,
    IonTitle,
    IonHeader,
    IonSpinner,
    IonToolbar
  ]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      // Obtener los datos del formulario
      const { name, email, password } = this.registerForm.value;

      try {
        // Llamar al servicio de registro
        const response = await this.authService.register(name, email, password).toPromise();

        console.log('Respuesta del servidor:', response);

        // Mostrar mensaje de éxito
        await this.showToast('Usuario registrado exitosamente', 'success');

        // Limpiar formulario
        this.registerForm.reset();

        // Opcional: Redirigir al login después del registro exitoso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

      } catch (error: any) {
        console.error('Error en registro:', error);

        // Manejar diferentes tipos de errores
        let errorMessage = 'Error al registrar usuario';

        if (error.status === 400) {
          errorMessage = 'Datos inválidos. Verifica la información ingresada';
        } else if (error.status === 409) {
          errorMessage = 'El email ya está registrado';
        } else if (error.status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        await this.showToast(errorMessage, 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      await this.showToast('Por favor completa todos los campos correctamente', 'warning');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
