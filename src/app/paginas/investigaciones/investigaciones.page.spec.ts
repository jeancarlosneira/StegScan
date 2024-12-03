import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestigacionesPage } from './investigaciones.page';

describe('InvestigacionesPage', () => {
  let component: InvestigacionesPage;
  let fixture: ComponentFixture<InvestigacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
