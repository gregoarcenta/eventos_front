import { TestBed } from '@angular/core/testing';

import { CatalogStore } from './catalog.store';

describe('DataStore', () => {
  let store: CatalogStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(CatalogStore);
  });

  it('should be created', () => {
    expect(CatalogStore).toBeTruthy();
  });
});
