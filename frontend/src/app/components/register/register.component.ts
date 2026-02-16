import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Athlete } from '../../services/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  athlete: Partial<Athlete> = {
    name: '',
    age: undefined,
    gender: '',
    sport: '',
    height: undefined,
    weight: undefined,
    speed_score: undefined,
    strength_score: undefined,
    endurance_score: undefined
  };

  error: string | null = null;
  success: string | null = null;
  isSubmitting = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = null;
    this.success = null;

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    const athleteData: Athlete = {
      name: this.athlete.name!,
      age: this.athlete.age!,
      gender: this.athlete.gender!,
      sport: this.athlete.sport!,
      height: this.athlete.height!,
      weight: this.athlete.weight!,
      speed_score: this.athlete.speed_score!,
      strength_score: this.athlete.strength_score!,
      endurance_score: this.athlete.endurance_score!
    };

    this.apiService.createAthlete(athleteData).subscribe({
      next: (response) => {
        this.success = 'Athlete registered successfully!';
        this.isSubmitting = false;
        
        // Reset form
        this.athlete = {
          name: '',
          age: undefined,
          gender: '',
          sport: '',
          height: undefined,
          weight: undefined,
          speed_score: undefined,
          strength_score: undefined,
          endurance_score: undefined
        };

        // Redirect to athletes list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/athletes']);
        }, 2000);
      },
      error: (err) => {
        this.error = err.error?.error || 'Failed to register athlete. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.athlete.name || !this.athlete.name.trim()) {
      this.error = 'Name is required';
      return false;
    }
    if (!this.athlete.age || this.athlete.age < 1 || this.athlete.age > 150) {
      this.error = 'Please enter a valid age';
      return false;
    }
    if (!this.athlete.gender) {
      this.error = 'Gender is required';
      return false;
    }
    if (!this.athlete.sport || !this.athlete.sport.trim()) {
      this.error = 'Sport is required';
      return false;
    }
    if (!this.athlete.height || this.athlete.height <= 0) {
      this.error = 'Please enter a valid height';
      return false;
    }
    if (!this.athlete.weight || this.athlete.weight <= 0) {
      this.error = 'Please enter a valid weight';
      return false;
    }
    if (this.athlete.speed_score === null || this.athlete.speed_score === undefined || this.athlete.speed_score < 0 || this.athlete.speed_score > 100) {
      this.error = 'Speed score must be between 0 and 100';
      return false;
    }
    if (this.athlete.strength_score === null || this.athlete.strength_score === undefined || this.athlete.strength_score < 0 || this.athlete.strength_score > 100) {
      this.error = 'Strength score must be between 0 and 100';
      return false;
    }
    if (this.athlete.endurance_score === null || this.athlete.endurance_score === undefined || this.athlete.endurance_score < 0 || this.athlete.endurance_score > 100) {
      this.error = 'Endurance score must be between 0 and 100';
      return false;
    }
    return true;
  }
}
