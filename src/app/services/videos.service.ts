import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, catchError, of, map } from 'rxjs';

export interface VideoYoutube {
  id: string;
  url: string;
  titre: string;
  auteur: string;
  miniature: string;
}

interface OEmbedResponse {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

// Identifiants des vidéos de la chaîne à afficher.
// Ajouter/retirer un id ici suffit à mettre à jour la liste affichée.
const VIDEO_IDS: string[] = [
  'NMZSv8GseAo',
  'Euu1X6nsMOg',
  'veQdMkz46T4',
  'IGx2v_6Qq28',
  'Jd1zS0vFiSg',
  'QL-NChbn0hI',
  'jU99z_sMa8Y',
  'aXFOMGpZT8o'
];

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private readonly http = inject(HttpClient);

  getVideos(): Observable<VideoYoutube[]> {
    const requetes = VIDEO_IDS.map((id) => this.getVideo(id));
    return forkJoin(requetes);
  }

  private getVideo(id: string): Observable<VideoYoutube> {
    const url = `https://www.youtube.com/watch?v=${id}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

    return this.http.get<OEmbedResponse>(oembedUrl).pipe(
      map((res) => ({
        id,
        url,
        titre: res.title,
        auteur: res.author_name,
        miniature: res.thumbnail_url
      })),
      catchError(() =>
        of({
          id,
          url,
          titre: 'Vidéo indisponible',
          auteur: 'Coding Vibes',
          miniature: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
        })
      )
    );
  }
}
