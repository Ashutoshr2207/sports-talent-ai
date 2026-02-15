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

  score: number | null = null;   // ✅ ADD HERE

  constructor(private api: ApiService) {}

  ngOnInit() {
    console.log('Attempting to connect to backend...');
    
    this.api.getMessage().subscribe({
      next: (data) => {
        this.message = data.message;
        this.error = null;
      },
      error: (err) => {
        this.message = "Backend not connected";
        this.error = err.message || 'Failed to connect to backend';

        if (err.status === 0) {
          this.error = 'Cannot reach backend. Make sure backend server is running on http://localhost:5000';
        }
      }
    });
  }

  // ✅ ADD THIS METHOD BELOW ngOnInit()
  uploadVideo(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("video", file);

    this.api.uploadVideo(formData).subscribe((res: any) => {
      this.score = res.score;
    });
  }

}
