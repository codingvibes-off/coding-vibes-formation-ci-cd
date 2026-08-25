import { Routes } from '@angular/router';
import { FormulaireComponent } from './pages/formulaire/formulaire.component';
import { VideosComponent } from './pages/videos/videos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inscription', pathMatch: 'full' },
  { path: 'inscription', component: FormulaireComponent, title: 'Inscription — Coding Vibes' },
  { path: 'videos', component: VideosComponent, title: 'Vidéos — Coding Vibes' },
  { path: '**', redirectTo: 'inscription' }
];
