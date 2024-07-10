import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceInfoComponent } from './fonte-info.component';

describe('SourceInfoComponent', () => {
  let component: SourceInfoComponent;
  let fixture: ComponentFixture<SourceInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SourceInfoComponent]
    });
    fixture = TestBed.createComponent(SourceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
