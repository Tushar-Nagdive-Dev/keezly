import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../services/app-state.service';
import { AlertItem, DashboardData } from '../../models/dashboard.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dash-board-component.html',
  styleUrls: ['./dash-board-component.scss']
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  }
function formatDistanceToNow(arg0: Date, arg1: { addSuffix: boolean; }) {
  throw new Error('Function not implemented.');
}

