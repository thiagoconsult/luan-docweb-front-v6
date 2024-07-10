import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistComponent } from './hist.component';

describe('HistComponent', () => {
  let component: HistComponent;
  let fixture: ComponentFixture<HistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistComponent]
    });
    fixture = TestBed.createComponent(HistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
