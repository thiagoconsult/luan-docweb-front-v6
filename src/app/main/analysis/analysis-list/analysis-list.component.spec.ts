import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisListComponent } from './analysis-list.component';

describe('AnalysisListComponent', () => {
  let component: AnalysisListComponent;
  let fixture: ComponentFixture<AnalysisListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnalysisListComponent]
    });
    fixture = TestBed.createComponent(AnalysisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
