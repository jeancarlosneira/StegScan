import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportfinPage } from './reportfin.page';

describe('ReportfinPage', () => {
  let component: ReportfinPage;
  let fixture: ComponentFixture<ReportfinPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportfinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
