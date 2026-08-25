import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { FormulaireComponent } from './formulaire.component';

describe('FormulaireComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FormulaireComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not navigate when the form is invalid', () => {
    const fixture = TestBed.createComponent(FormulaireComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    fixture.componentInstance.onSubmit();

    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should navigate to /videos when the form is valid', () => {
    const fixture = TestBed.createComponent(FormulaireComponent);
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');

    fixture.componentInstance.form.setValue({
      prenom: 'Ada',
      email: 'ada@coding-vibes.fr',
      niveau: 'debutant'
    });
    fixture.componentInstance.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith(['/videos']);
  });
});
