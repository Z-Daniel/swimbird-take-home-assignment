import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { page } from 'vitest/browser';
import { routes } from '../../app.routes';
import { AppHeaderComponent } from './app-header.component';

class AppHeaderPage {
  constructor(private readonly fixture: ComponentFixture<AppHeaderComponent>) {}

  get logo() {
    return page.getByRole('link', { name: 'Portfolio' });
  }

  get desktopNav() {
    return page.getByRole('navigation', { name: 'Main navigation' });
  }

  get mobileNav() {
    return page.getByRole('navigation', { name: 'Mobile navigation' });
  }

  get hamburger() {
    return page.getByRole('button', { name: 'Toggle menu' });
  }

  openMobileMenu(): void {
    this.fixture.componentInstance['menuOpen'].set(true);
    this.fixture.detectChanges();
  }

  closeMobileMenu(): void {
    this.fixture.componentInstance['menuOpen'].set(false);
    this.fixture.detectChanges();
  }
}

async function setup() {
  await TestBed.configureTestingModule({
    imports: [AppHeaderComponent],
    providers: [provideRouter(routes)],
  }).compileComponents();

  const fixture = TestBed.createComponent(AppHeaderComponent);
  fixture.detectChanges();
  return { fixture, po: new AppHeaderPage(fixture) };
}

describe('AppHeaderComponent — desktop (≥ 640px)', () => {
  let po: AppHeaderPage;

  beforeEach(async () => {
    await page.viewport(1280, 720);
    ({ po } = await setup());
  });

  it('should render the logo', async () => {
    await expect.element(po.logo).toBeVisible();
  });

  it('should show the desktop nav with Dashboard and Settings links', async () => {
    await expect.element(po.desktopNav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect.element(po.desktopNav.getByRole('link', { name: 'Settings' })).toBeVisible();
  });

});

describe('AppHeaderComponent — mobile (< 640px)', () => {
  let po: AppHeaderPage;

  beforeEach(async () => {
    await page.viewport(414, 896);
    ({ po } = await setup());
  });

  it('should render the logo', async () => {
    await expect.element(po.logo).toBeVisible();
  });

  it('should show the hamburger button', async () => {
    await expect.element(po.hamburger).toBeVisible();
  });

  it('should not show the mobile menu initially', async () => {
    await expect.element(po.mobileNav).not.toBeInTheDocument();
  });

  it('should show the mobile menu when opened', async () => {
    po.openMobileMenu();
    await expect.element(po.mobileNav).toBeVisible();
  });

  it('should render Dashboard and Settings links in the mobile menu', async () => {
    po.openMobileMenu();
    await expect.element(po.mobileNav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect.element(po.mobileNav.getByRole('link', { name: 'Settings' })).toBeVisible();
  });

  it('should hide the mobile menu when closed', async () => {
    po.openMobileMenu();
    po.closeMobileMenu();
    await expect.element(po.mobileNav).not.toBeInTheDocument();
  });
});
