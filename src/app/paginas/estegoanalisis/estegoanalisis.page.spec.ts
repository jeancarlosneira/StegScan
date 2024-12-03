import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstegoanalisisPage } from './estegoanalisis.page';

describe('EstegoanalisisPage', () => {
  let component: EstegoanalisisPage;
  let fixture: ComponentFixture<EstegoanalisisPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstegoanalisisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
