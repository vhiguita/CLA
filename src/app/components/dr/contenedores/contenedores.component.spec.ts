import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenedoresComponent } from './contenedores.component';

describe('ContenedoresComponent', () => {
  let component: ContenedoresComponent;
  let fixture: ComponentFixture<ContenedoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenedoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
