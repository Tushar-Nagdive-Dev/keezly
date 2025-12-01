import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultList } from './vault-list';

describe('VaultList', () => {
  let component: VaultList;
  let fixture: ComponentFixture<VaultList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VaultList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VaultList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
