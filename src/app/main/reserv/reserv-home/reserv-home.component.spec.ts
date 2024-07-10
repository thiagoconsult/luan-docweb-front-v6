import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservHomeComponent } from './reserv-home.component';

describe('ReservHomeComponent', () => {
  let component: ReservHomeComponent;
  let fixture: ComponentFixture<ReservHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservHomeComponent]
    });
    fixture = TestBed.createComponent(ReservHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
