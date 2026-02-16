import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, Athlete } from '../../services/api';

@Component({
  selector: 'app-athletes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './athletes.component.html',
  styleUrl: './athletes.component.css'
})
export class AthletesComponent implements OnInit {
  athletes: Athlete[] = [];
  loading = true;
  error: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAthletes();
  }

  loadAthletes() {
    this.loading = true;
    this.error = null;

    this.apiService.getAthletes().subscribe({
      next: (response) => {
        this.athletes = response.athletes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load athletes. Please try again.';
        this.loading = false;
        console.error('Error loading athletes:', err);
      }
    });
  }

  getAverageScore(athlete: Athlete): number {
    return Math.round(
      (athlete.speed_score + athlete.strength_score + athlete.endurance_score) / 3
    );
  }
}
