import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkTransfer } from './bulk-transfer';

describe('BulkTransfer', () => {
  let component: BulkTransfer;
  let fixture: ComponentFixture<BulkTransfer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkTransfer],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkTransfer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
