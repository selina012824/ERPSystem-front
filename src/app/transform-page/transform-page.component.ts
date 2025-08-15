import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../@service/dataService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transform-page',
  imports: [RouterOutlet, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './transform-page.component.html',
  styleUrl: './transform-page.component.scss'
})
export class TransformPageComponent {

  constructor(private router: Router, private dataService: DataService) { }
  logIn: Boolean = true;
  isSideAreaOpen: Boolean = false;

  toggleSideArea() {
    this.isSideAreaOpen = !this.isSideAreaOpen;
  }

  logout() {
    sessionStorage.setItem('successMessage', 'ログアウト成功しました');
    this.dataService.employeeID = "";
    this.router.navigateByUrl('/');
    this.router.navigateByUrl('/').then(() => {
      location.reload();
    });
  }

  ngOnInit(): void {

  }
}

