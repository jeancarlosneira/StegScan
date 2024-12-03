import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportemetaPage } from './reportemeta.page';

describe('ReportemetaPage', () => {
  let component: ReportemetaPage;
  let fixture: ComponentFixture<ReportemetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportemetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
