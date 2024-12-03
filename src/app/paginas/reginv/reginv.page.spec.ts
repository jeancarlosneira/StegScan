import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReginvPage } from './reginv.page';

describe('ReginvPage', () => {
  let component: ReginvPage;
  let fixture: ComponentFixture<ReginvPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReginvPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
