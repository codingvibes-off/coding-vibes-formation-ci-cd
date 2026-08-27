import { Routes } from '@angular/router';
import { FormulaireComponent } from './pages/formulaire/formulaire.component';
import { VideosComponent } from './pages/videos/videos.component';

export const routes: Routes = [
  { path: '', component: VideosComponent, title: 'Formations — Coding Vibes' },
  { path: 'inscription', component: FormulaireComponent, title: 'Inscription — Coding Vibes' },
  { path: 'videos', redirectTo: '', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
