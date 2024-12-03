import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsoappPage } from './usoapp.page';

describe('UsoappPage', () => {
  let component: UsoappPage;
  let fixture: ComponentFixture<UsoappPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsoappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
