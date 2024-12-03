import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Metadatos2Page } from './metadatos2.page';

describe('MetadatosPage', () => {
  let component: Metadatos2Page;
  let fixture: ComponentFixture<Metadatos2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Metadatos2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
