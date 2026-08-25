import { Injectable, signal } from '@angular/core';

export interface Inscription {
  prenom: string;
  email: string;
  niveau: 'debutant' | 'intermediaire' | 'avance';
}

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {
  private readonly _inscription = signal<Inscription | null>(null);

  readonly inscription = this._inscription.asReadonly();

  enregistrer(data: Inscription): void {
    this._inscription.set(data);
  }

  estInscrit(): boolean {
    return this._inscription() !== null;
  }
}
