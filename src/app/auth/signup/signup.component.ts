import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor() { }

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    // send a request to the backend to create a new user (use Auth Service)
    console.log(form.value);
  }
}
