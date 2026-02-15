import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService } from './services/api';

@Component({
  selector: 'app-root',
  standalone: true,
    imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  message = "Ashutosh";
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('Attempting to connect to backend...');
    
    this.api.getMessage().subscribe({
      next: (data) => {
        console.log('Backend response:', data);
        this.message = data.message;
        this.error = null;
      },
      error: (err) => {
        console.error('Backend connection error:', err);
        this.message = "Backend not connected";
        this.error = err.message || 'Failed to connect to backend';
        
        // More detailed error info
        if (err.status === 0) {
          this.error = 'Cannot reach backend. Make sure backend server is running on http://localhost:5000';
        }
      }
    });
  }
}