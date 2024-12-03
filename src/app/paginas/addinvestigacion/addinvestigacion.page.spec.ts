import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddinvestigacionPage } from './addinvestigacion.page';

describe('AddinvestigacionPage', () => {
  let component: AddinvestigacionPage;
  let fixture: ComponentFixture<AddinvestigacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddinvestigacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
