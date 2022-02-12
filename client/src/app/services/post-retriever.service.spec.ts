import { TestBed } from '@angular/core/testing';

import { PostRetrieverService } from './post-retriever.service';

describe('PostRetrieverService', () => {
  let service: PostRetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostRetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
