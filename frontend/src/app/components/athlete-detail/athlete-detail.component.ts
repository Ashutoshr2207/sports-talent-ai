import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiService, Athlete, AthleteAnalysis } from '../../services/api';

@Component({
  selector: 'app-athlete-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './athlete-detail.component.html',
  styleUrl: './athlete-detail.component.css'
})
export class AthleteDetailComponent implements OnInit {
  athlete: Athlete | null = null;
  analysis: AthleteAnalysis | null = null;
  loading = true;
  error: string | null = null;
  athleteId: number | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.athleteId = +params['id'];
      this.loadAthleteData();
    });
  }

  loadAthleteData() {
    if (!this.athleteId) {
      this.error = 'Invalid athlete ID';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    // Load athlete details
    this.apiService.getAthlete(this.athleteId).subscribe({
      next: (response) => {
        this.athlete = response.athlete;
        this.loadAnalysis();
      },
      error: (err) => {
        this.error = 'Failed to load athlete details.';
        this.loading = false;
        console.error('Error loading athlete:', err);
      }
    });
  }

  loadAnalysis() {
    if (!this.athleteId) return;

    this.apiService.getAthleteAnalysis(this.athleteId).subscribe({
      next: (response) => {
        this.analysis = response.analysis;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load analysis.';
        this.loading = false;
        console.error('Error loading analysis:', err);
      }
    });
  }

  getRatingClass(rating: string): string {
    const ratingMap: { [key: string]: string } = {
      'Elite': 'rating-elite',
      'Advanced': 'rating-advanced',
      'Intermediate': 'rating-intermediate',
      'Beginner': 'rating-beginner'
    };
    return ratingMap[rating] || '';
  }
}
