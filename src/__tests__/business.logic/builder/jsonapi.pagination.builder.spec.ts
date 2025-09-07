import JsonapiPaginationBuilder, { 
  get_pagination_options,
  IPaginatedResult 
} from '../../../business.logic/builder/jsonapi.pagination.builder';

describe('Testing file: src/business.logic/builder/jsonapi.pagination.builder.ts', () => {

  describe('[class] JsonapiPaginationBuilder', () => {
    
    test('should generate correct pagination links for middle page', () => {
      const opts: IPaginatedResult = {
        totalDocs: 100,
        limit: 10,
        page: 5,
        totalPages: 10,
        nextPage: 6,
        hasNextPage: true,
        prevPage: 4,
        hasPrevPage: true,
        pagingCounter: 41
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=5&page[size]=10');
      expect(links.first).toBe('?page[number]=1&page[size]=10');
      expect(links.last).toBe('?page[number]=10&page[size]=10');
      expect(links.prev).toBe('?page[number]=4&page[size]=10');
      expect(links.next).toBe('?page[number]=6&page[size]=10');
    });

    test('should generate correct pagination links for first page', () => {
      const opts: IPaginatedResult = {
        totalDocs: 100,
        limit: 10,
        page: 1,
        totalPages: 10,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=1&page[size]=10');
      expect(links.first).toBe('?page[number]=1&page[size]=10');
      expect(links.last).toBe('?page[number]=10&page[size]=10');
      expect(links.prev).toBeUndefined();
      expect(links.next).toBe('?page[number]=2&page[size]=10');
    });

    test('should generate correct pagination links for last page', () => {
      const opts: IPaginatedResult = {
        totalDocs: 100,
        limit: 10,
        page: 10,
        totalPages: 10,
        nextPage: null,
        hasNextPage: false,
        prevPage: 9,
        hasPrevPage: true,
        pagingCounter: 91
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=10&page[size]=10');
      expect(links.first).toBe('?page[number]=1&page[size]=10');
      expect(links.last).toBe('?page[number]=10&page[size]=10');
      expect(links.prev).toBe('?page[number]=9&page[size]=10');
      expect(links.next).toBeUndefined();
    });

    test('should include filter in pagination links when provided', () => {
      const opts: IPaginatedResult = {
        totalDocs: 50,
        limit: 5,
        page: 3,
        totalPages: 10,
        nextPage: 4,
        hasNextPage: true,
        prevPage: 2,
        hasPrevPage: true,
        pagingCounter: 11,
        filter: 'filter[name]=test&sort=created'
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=3&page[size]=5&filter[name]=test&sort=created');
      expect(links.first).toBe('?page[number]=1&page[size]=5&filter[name]=test&sort=created');
      expect(links.last).toBe('?page[number]=10&page[size]=5&filter[name]=test&sort=created');
      expect(links.prev).toBe('?page[number]=2&page[size]=5&filter[name]=test&sort=created');
      expect(links.next).toBe('?page[number]=4&page[size]=5&filter[name]=test&sort=created');
    });

    test('should handle single page correctly', () => {
      const opts: IPaginatedResult = {
        totalDocs: 5,
        limit: 10,
        page: 1,
        totalPages: 1,
        nextPage: null,
        hasNextPage: false,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=1&page[size]=5');
      expect(links.first).toBe('?page[number]=1&page[size]=5');
      expect(links.last).toBe('?page[number]=1&page[size]=5');
      expect(links.prev).toBeUndefined();
      expect(links.next).toBeUndefined();
    });

    test('should limit page size to total docs when limit exceeds total', () => {
      const opts: IPaginatedResult = {
        totalDocs: 5,
        limit: 20,
        page: 1,
        totalPages: 1,
        nextPage: null,
        hasNextPage: false,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      const builder = new JsonapiPaginationBuilder(opts);
      const links = builder.build();

      expect(links.self).toBe('?page[number]=1&page[size]=5');
    });
  });

  describe('[function] get_pagination_options', () => {
    
    test('should calculate pagination options correctly', () => {
      const result = get_pagination_options({
        page: 3,
        limit: 5,
        totalDocs: 23
      });

      expect(result).toEqual({
        totalDocs: 23,
        limit: 5,
        page: 3,
        totalPages: 5,
        nextPage: 4,
        hasNextPage: true,
        prevPage: 2,
        hasPrevPage: true,
        pagingCounter: 11, // ((3-1) * 5) + 1 = 11
        filter: ''
      });
    });

    test('should handle first page correctly', () => {
      const result = get_pagination_options({
        page: 1,
        limit: 10,
        totalDocs: 50
      });

      expect(result.hasPrevPage).toBe(false);
      expect(result.prevPage).toBe(null);
      expect(result.hasNextPage).toBe(true);
      expect(result.nextPage).toBe(2);
      expect(result.pagingCounter).toBe(1);
    });

    test('should handle last page correctly', () => {
      const result = get_pagination_options({
        page: 5,
        limit: 10,
        totalDocs: 50
      });

      expect(result.hasPrevPage).toBe(true);
      expect(result.prevPage).toBe(4);
      expect(result.hasNextPage).toBe(false);
      expect(result.nextPage).toBe(null);
      expect(result.pagingCounter).toBe(41); // ((5-1) * 10) + 1 = 41
    });

    test('should handle edge case with 0 total docs', () => {
      const result = get_pagination_options({
        page: 1,
        limit: 10,
        totalDocs: 0
      });

      expect(result.totalPages).toBe(1);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(false);
      expect(result.pagingCounter).toBe(1);
    });

    test('should throw error for invalid limit', () => {
      expect(() => {
        get_pagination_options({
          page: 1,
          limit: 0,
          totalDocs: 10
        });
      }).toThrow('Limit must be greater than 0');

      expect(() => {
        get_pagination_options({
          page: 1,
          limit: -5,
          totalDocs: 10
        });
      }).toThrow('Limit must be greater than 0');
    });

    test('should throw error for invalid page', () => {
      expect(() => {
        get_pagination_options({
          page: 0,
          limit: 10,
          totalDocs: 10
        });
      }).toThrow('Page must be greater than 0');

      expect(() => {
        get_pagination_options({
          page: -1,
          limit: 10,
          totalDocs: 10
        });
      }).toThrow('Page must be greater than 0');
    });

    test('should include filter when provided', () => {
      const result = get_pagination_options({
        page: 2,
        limit: 5,
        totalDocs: 20,
        filter: 'search=test'
      });

      expect(result.filter).toBe('search=test');
    });
  });
});
