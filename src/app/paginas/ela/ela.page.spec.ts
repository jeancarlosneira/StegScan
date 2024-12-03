import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ELAPage } from './ela.page';

describe('ELAPage', () => {
  let component: ELAPage;
  let fixture: ComponentFixture<ELAPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ELAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
