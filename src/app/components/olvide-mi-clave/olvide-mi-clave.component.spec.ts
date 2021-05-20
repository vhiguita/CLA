import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvideMiClaveComponent } from './olvide-mi-clave.component';

describe('OlvideMiClaveComponent', () => {
  let component: OlvideMiClaveComponent;
  let fixture: ComponentFixture<OlvideMiClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvideMiClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvideMiClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
