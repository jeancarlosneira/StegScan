import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompElaPage } from './comp-ela.page';

describe('CompElaPage', () => {
  let component: CompElaPage;
  let fixture: ComponentFixture<CompElaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CompElaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
