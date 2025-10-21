import { Types } from 'mongoose';
import get_bookmark_collection_endpoint from '../../endpoint/get.bookmark.collection.ep';
import * as bookmarkModel from '../../model/bookmark';
import { IBookmarkDocument } from '../../schema/bookmarks';

// Mock the dependencies
jest.mock('../../model/bookmark');
jest.mock('../../utility/logging');
jest.mock('../../config', () => ({
  default: {
    PAGINATION_BOOKMARKS_LIMIT: '10',
    MAX_LOADED_BOOKMARK_PAGES: '4',
    DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME: 'test_bookmarks_search'
  }
}));

describe('GET /bookmarks - Bookmark Collection Endpoint with Pagination', () => {
  let mockRequest: any;
  let mockReply: any;
  const mockPaginate = bookmarkModel.BookmarkPaginationModel.paginate as jest.MockedFunction<typeof bookmarkModel.BookmarkPaginationModel.paginate>;

  // Helper function to create mock bookmark documents
  const createMockBookmark = (id: number): IBookmarkDocument => ({
    _id: new Types.ObjectId(),
    title: `Test Bookmark ${id}`,
    note: `This is test bookmark number ${id}`,
    videoid: `video${id}`,
    platform: 'youtube',
    url: `https://youtube.com/watch?v=video${id}`,
    thumbnail_url: `https://img.youtube.com/vi/video${id}/default.jpg`,
    start_seconds: 0,
    end_seconds: 0,
    upvotes: id * 10,
    downvotes: id * 2,
    is_active: true,
    is_published: true,
    created_at: new Date(),
    modified_at: new Date(),
  } as IBookmarkDocument);

  beforeEach(() => {
    // Setup mock request with default query params
    mockRequest = {
      query: {
        page: {},
        filter: {}
      }
    };

    // Setup mock reply
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Successful pagination responses', () => {
    it('should return first page with default limit (10 items)', async () => {
      // Mock paginate result for first page
      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 1,
        totalPages: 3,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              type: 'bookmarks',
              id: expect.any(String),
              attributes: expect.objectContaining({
                title: expect.any(String),
                videoid: expect.any(String)
              })
            })
          ])
        })
      );

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data.length).toBe(10);
    });

    it('should return correct pagination links for first page', async () => {
      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 1,
        totalPages: 3,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.links).toBeDefined();
      expect(sentData.links.self).toContain('page[number]=1');
      expect(sentData.links.self).toContain('page[size]=10');
      expect(sentData.links.first).toBeDefined();
      expect(sentData.links.last).toBeDefined();
      expect(sentData.links.next).toBeDefined();
      expect(sentData.links.prev).toBeUndefined(); // First page has no prev
    });

    it('should return second page correctly with prev and next links', async () => {
      mockRequest.query.page = { number: 2, size: 10 };

      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 11));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 2,
        totalPages: 3,
        nextPage: 3,
        hasNextPage: true,
        prevPage: 1,
        hasPrevPage: true,
        pagingCounter: 11
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data.length).toBe(10);
      expect(sentData.links.prev).toBeDefined();
      expect(sentData.links.prev).toContain('page[number]=1');
      expect(sentData.links.next).toBeDefined();
      expect(sentData.links.next).toContain('page[number]=3');
    });

    it('should return last page with remaining items and no next link', async () => {
      mockRequest.query.page = { number: 3, size: 10 };

      const mockDocs = Array.from({ length: 5 }, (_, i) => createMockBookmark(i + 21));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 3,
        totalPages: 3,
        nextPage: null,
        hasNextPage: false,
        prevPage: 2,
        hasPrevPage: true,
        pagingCounter: 21
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data.length).toBe(5); // 25 total - 20 from first two pages = 5
      expect(sentData.links.prev).toBeDefined();
      expect(sentData.links.next).toBeUndefined(); // Last page has no next
    });

    it('should respect custom page size', async () => {
      mockRequest.query.page = { number: 1, size: 5 };

      const mockDocs = Array.from({ length: 5 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 5,
        page: 1,
        totalPages: 5,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data.length).toBe(5);
      expect(sentData.links.self).toContain('page[size]=5');
    });

    it('should handle empty results gracefully', async () => {
      mockRequest.query.page = { number: 100, size: 10 };

      const mockPaginateResult = {
        docs: [],
        totalDocs: 25,
        limit: 10,
        page: 100,
        totalPages: 3,
        nextPage: null,
        hasNextPage: false,
        prevPage: 3,
        hasPrevPage: true,
        pagingCounter: 991
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data.length).toBe(0);
    });

    it('should include metadata with max_loaded_pages', async () => {
      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 1,
        totalPages: 3,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.meta).toBeDefined();
      expect(sentData.meta.max_loaded_pages).toBeDefined();
      expect(sentData.meta.max_loaded_pages).toBe('4');
    });

    it('should return correct JSON:API resource structure', async () => {
      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 1,
        totalPages: 3,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.data[0]).toMatchObject({
        type: 'bookmarks',
        id: expect.any(String),
        attributes: expect.objectContaining({
          title: expect.any(String),
          videoid: expect.any(String),
          platform: expect.any(String),
          url: expect.any(String),
          thumbnail_url: expect.any(String),
          upvotes: expect.any(Number),
          downvotes: expect.any(Number),
        })
      });
    });

    it('should calculate total pages correctly in last link', async () => {
      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 10,
        page: 1,
        totalPages: 3,
        nextPage: 2,
        hasNextPage: true,
        prevPage: null,
        hasPrevPage: false,
        pagingCounter: 1
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      const sentData = mockReply.send.mock.calls[0][0];
      expect(sentData.links.last).toContain('page[number]=3');
    });
  });

  describe('Database query verification', () => {
    it('should call paginate with correct query and options', async () => {
      mockRequest.query.page = { number: 2, size: 15 };

      const mockDocs = Array.from({ length: 10 }, (_, i) => createMockBookmark(i + 1));
      const mockPaginateResult = {
        docs: mockDocs,
        totalDocs: 25,
        limit: 15,
        page: 2,
        totalPages: 2,
        nextPage: null,
        hasNextPage: false,
        prevPage: 1,
        hasPrevPage: true,
        pagingCounter: 16
      };

      mockPaginate = jest.fn().mockResolvedValue(mockPaginateResult);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      expect(mockPaginate).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: true
        }),
        expect.objectContaining({
          page: 2,
          limit: 15
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockPaginate = jest.fn().mockRejectedValue(dbError);

      await get_bookmark_collection_endpoint(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              status: '500'
            })
          ])
        })
      );
    });
  });
});

