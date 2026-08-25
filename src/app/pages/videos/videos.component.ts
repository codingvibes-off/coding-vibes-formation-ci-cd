import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { VideosService, VideoYoutube } from '../../services/videos.service';
import { InscriptionService } from '../../services/inscription.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.css'
})
export class VideosComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly videosService = inject(VideosService);
  private readonly inscriptionService = inject(InscriptionService);

  readonly inscription = this.inscriptionService.inscription;

  readonly videos = signal<VideoYoutube[]>([]);
  readonly chargement = signal(true);
  readonly erreur = signal(false);

  ngOnInit(): void {
    this.videosService.getVideos().subscribe({
      next: (videos) => {
        this.videos.set(videos);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set(true);
        this.chargement.set(false);
      }
    });
  }

  retourFormulaire(): void {
    this.router.navigate(['/inscription']);
  }
}
