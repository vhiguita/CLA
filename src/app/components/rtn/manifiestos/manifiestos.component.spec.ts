import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifiestosComponent } from './manifiestos.component';

describe('ManifiestosComponent', () => {
  let component: ManifiestosComponent;
  let fixture: ComponentFixture<ManifiestosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManifiestosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManifiestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
