import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResortViewComponent } from './resort-view.component';

describe('ResortViewComponent', () => {
  let component: ResortViewComponent;
  let fixture: ComponentFixture<ResortViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResortViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResortViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
