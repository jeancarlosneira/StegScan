import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubirImgPage } from './subir-img.page';

describe('SubirImgPage', () => {
  let component: SubirImgPage;
  let fixture: ComponentFixture<SubirImgPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
