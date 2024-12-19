import { Component, OnInit } from '@angular/core';
import { InactivityService } from './inactivity.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private inactivityService: InactivityService) {}

  ngOnInit(): void {
    this.inactivityService.startInactivityTimer();
  }
}
