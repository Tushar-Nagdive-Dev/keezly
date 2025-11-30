import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultView } from './vault-view';

describe('VaultView', () => {
  let component: VaultView;
  let fixture: ComponentFixture<VaultView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
