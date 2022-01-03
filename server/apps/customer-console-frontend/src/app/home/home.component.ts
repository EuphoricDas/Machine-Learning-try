import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../console/shared/services/authentication.service';

declare var $: any;
declare var WOW: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate(['/console']);
    }
  }

  private _scrollHandler = this.scrollHandler.bind(this);

  @ViewChild('navbar') navbar: ElementRef;

  ngOnInit(): void {
    document.body.classList.add('landing-page');
    document.body.id = "page-top";

    window.addEventListener('scroll', this._scrollHandler, false);

    // Highlight the top nav as scrolling
    $('body').scrollspy({
      target: '.navbar-fixed-top',
      offset: 80
    })

    // Page scrolling feature
    $('a.page-scroll').bind('click', function (event) {
      var link = $(this);
      $('html, body').stop().animate({
        scrollTop: $(link.attr('href')).offset().top - 50
      }, 500);
      event.preventDefault();
      event.stopImmediatePropagation();
      $("#navbar").collapse('hide');
      return false;
    });

    new WOW().init();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    document.body.classList.remove('landing-page');
    document.body.id = "";

    window.removeEventListener('scroll', this._scrollHandler);
  }

  private didScroll = false;
  private changeHeaderOn = 200;

  scrollHandler() {
    if (!this.didScroll) {
      this.didScroll = true;
      setTimeout(() => this.scrollPage(), 250);
    }
  }

  private scrollPage() {
    var sy = this.scrollY();
    if (sy >= this.changeHeaderOn) {
      this.navbar.nativeElement.classList.add('navbar-scroll');
    }
    else {
      this.navbar.nativeElement.classList.remove('navbar-scroll');
    }
    this.didScroll = false;
  }

  private scrollY() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }
}
