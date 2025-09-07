import JsonapiResponseBuilder from '../../../business.logic/builder/jsonapi.response.builder';

describe('Testing file: src/business.logic/builder/jsonapi.response.builder.ts', () => {

  describe('[class] JsonapiResponseBuilder - Pagination Integration', () => {
    
    test('should build collection response with pagination using minimal options', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .addResource({
          type: 'posts',
          id: '1',
          attributes: { title: 'Test Post 1' }
        })
        .addResource({
          type: 'posts', 
          id: '2',
          attributes: { title: 'Test Post 2' }
        })
        .withPagination({
          page: 2,
          limit: 5,
          totalDocs: 25
        });

      const response = builder.buildCollection();

      expect(response.data).toHaveLength(2);
      expect(response.links).toBeDefined();
      expect(response.links?.self).toBe('?page[number]=2&page[size]=5');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=5');
      expect(response.links?.last).toBe('?page[number]=5&page[size]=5');
      expect(response.links?.prev).toBe('?page[number]=1&page[size]=5');
      expect(response.links?.next).toBe('?page[number]=3&page[size]=5');
    });

    test('should build collection response with pagination using convenience method', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .addResource({
          type: 'users',
          id: '1',
          attributes: { name: 'John Doe' }
        })
        .withCollectionPagination(50, 3, 10, 'filter[status]=active');

      const response = builder.buildCollection();

      expect(response.data).toHaveLength(1);
      expect(response.links).toBeDefined();
      expect(response.links?.self).toBe('?page[number]=3&page[size]=10&filter[status]=active');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=10&filter[status]=active');
      expect(response.links?.last).toBe('?page[number]=5&page[size]=10&filter[status]=active');
      expect(response.links?.prev).toBe('?page[number]=2&page[size]=10&filter[status]=active');
      expect(response.links?.next).toBe('?page[number]=4&page[size]=10&filter[status]=active');
    });

    test('should build first page pagination without prev link', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(100, 1, 20);

      const response = builder.buildCollection();

      expect(response.links?.self).toBe('?page[number]=1&page[size]=20');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=20');
      expect(response.links?.last).toBe('?page[number]=5&page[size]=20');
      expect(response.links?.prev).toBeUndefined();
      expect(response.links?.next).toBe('?page[number]=2&page[size]=20');
    });

    test('should build last page pagination without next link', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(100, 5, 20);

      const response = builder.buildCollection();

      expect(response.links?.self).toBe('?page[number]=5&page[size]=20');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=20');
      expect(response.links?.last).toBe('?page[number]=5&page[size]=20');
      expect(response.links?.prev).toBe('?page[number]=4&page[size]=20');
      expect(response.links?.next).toBeUndefined();
    });

    test('should build single page pagination without prev/next links', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(5, 1, 10);

      const response = builder.buildCollection();

      expect(response.links?.self).toBe('?page[number]=1&page[size]=5');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=5');
      expect(response.links?.last).toBe('?page[number]=1&page[size]=5');
      expect(response.links?.prev).toBeUndefined();
      expect(response.links?.next).toBeUndefined();
    });

    test('should work with withPaginationLinks method using full pagination result', () => {
      const paginationResult = {
        totalDocs: 75,
        limit: 15,
        page: 3,
        totalPages: 5,
        nextPage: 4,
        hasNextPage: true,
        prevPage: 2,
        hasPrevPage: true,
        pagingCounter: 31,
        filter: 'sort=-created_at'
      };

      const builder = JsonapiResponseBuilder.forCollection()
        .addResource({
          type: 'articles',
          id: '1',
          attributes: { title: 'Article 1' }
        })
        .withPaginationLinks(paginationResult);

      const response = builder.buildCollection();

      expect(response.data).toHaveLength(1);
      expect(response.links?.self).toBe('?page[number]=3&page[size]=15&sort=-created_at');
      expect(response.links?.first).toBe('?page[number]=1&page[size]=15&sort=-created_at');
      expect(response.links?.last).toBe('?page[number]=5&page[size]=15&sort=-created_at');
      expect(response.links?.prev).toBe('?page[number]=2&page[size]=15&sort=-created_at');
      expect(response.links?.next).toBe('?page[number]=4&page[size]=15&sort=-created_at');
    });

    test('should allow manual link addition alongside pagination', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(20, 2, 10)
        .addLink('related', 'https://api.example.com/posts/1/comments');

      const response = builder.buildCollection();

      expect(response.links?.self).toBe('?page[number]=2&page[size]=10');
      expect(response.links?.related).toBe('https://api.example.com/posts/1/comments');
    });

    test('should work with empty collection and pagination', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(0, 1, 10);

      const response = builder.buildCollection();

      expect(response.data).toEqual([]);
      expect(response.links?.self).toBe('?page[number]=1&page[size]=0');
      expect(response.links?.prev).toBeUndefined();
      expect(response.links?.next).toBeUndefined();
    });

    test('should handle complex filter strings correctly', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withCollectionPagination(
          100, 
          3, 
          10, 
          'filter[category]=tech&filter[status]=published&sort=-created_at,title&include=author,comments'
        );

      const response = builder.buildCollection();

      const expectedFilter = 'filter[category]=tech&filter[status]=published&sort=-created_at,title&include=author,comments';
      expect(response.links?.self).toBe(`?page[number]=3&page[size]=10&${expectedFilter}`);
      expect(response.links?.first).toBe(`?page[number]=1&page[size]=10&${expectedFilter}`);
      expect(response.links?.next).toBe(`?page[number]=4&page[size]=10&${expectedFilter}`);
    });
  });

  describe('[class] JsonapiResponseBuilder - Basic Functionality', () => {
    
    test('should build single resource response', () => {
      const builder = JsonapiResponseBuilder.forSingleResource(
        { title: 'Test Post', content: 'Content here' },
        'posts'
      ).withId('123');

      const response = builder.build();

      expect(response.data).toEqual({
        type: 'posts',
        id: '123',
        attributes: {
          title: 'Test Post',
          content: 'Content here'
        }
      });
    });

    test('should build collection response with multiple resources', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .addResource({
          type: 'users',
          id: '1',
          attributes: { name: 'John' }
        })
        .addResource({
          type: 'users',
          id: '2', 
          attributes: { name: 'Jane' }
        });

      const response = builder.buildCollection();

      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data).toHaveLength(2);
    });

    test('should include meta information', () => {
      const builder = JsonapiResponseBuilder.forCollection()
        .withMeta({ 
          total: 100,
          processed_at: '2025-09-07T12:00:00Z'
        });

      const response = builder.buildCollection();

      expect(response.meta).toEqual({
        total: 100,
        processed_at: '2025-09-07T12:00:00Z'
      });
    });
  });
});
