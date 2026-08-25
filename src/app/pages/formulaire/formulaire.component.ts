import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulaire.component.html',
  styleUrl: './formulaire.component.css'
})
export class FormulaireComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly inscriptionService = inject(InscriptionService);

  readonly form = this.fb.nonNullable.group({
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    niveau: ['debutant', Validators.required]
  });

  submitted = false;

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.inscriptionService.enregistrer(this.form.getRawValue() as any);
    this.router.navigate(['/videos']);
  }

  get f() {
    return this.form.controls;
  }
}
