import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DicionarioViewComponent } from './dicionario-view.component';

describe('DicionarioViewComponent', () => {
  let component: DicionarioViewComponent;
  let fixture: ComponentFixture<DicionarioViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DicionarioViewComponent]
    });
    fixture = TestBed.createComponent(DicionarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
