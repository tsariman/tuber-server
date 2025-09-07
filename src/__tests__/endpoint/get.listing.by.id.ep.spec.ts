import { Types } from 'mongoose';
import get_listing_by_id_endpoint from '../../endpoint/get.listing.by.id.ep';
import { ListingModel } from '../../model/listing';
import JsonapiResponseBuilder from '../../business.logic/builder/jsonapi.response.builder';

// Mock the dependencies
jest.mock('../../model/listing');
jest.mock('../../utility/logging');

const mockListingModel = ListingModel as jest.Mocked<typeof ListingModel>;

describe('GET Listing by ID Endpoint', () => {
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    // Setup mock request
    mockRequest = {
      params: {
        id: '64abc123def456789012345'
      }
    };

    // Setup mock reply
    mockReply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Successful responses', () => {
    it('should return listing with bookmarks in JSON:API format', async () => {
      // Mock successful aggregation result
      const mockListing = {
        _id: new Types.ObjectId('64abc123def456789012345'),
        name: 'Test Listing',
        description: 'A test listing',
        is_active: true,
        is_private: false,
        is_published: true,
        user_id: 'user123',
        created_at: new Date('2024-01-15T10:30:00.000Z'),
        modified_at: new Date('2024-01-20T14:22:00.000Z'),
        tags: ['test', 'sample'],
        bookmarks: [
          {
            _id: new Types.ObjectId('64abc789def012345678901'),
            title: 'Test Bookmark',
            platform: 'youtube',
            start_seconds: 120,
            is_active: true,
            user_id: 'user123',
            listing_metadata: {
              html_tag: 'h2',
              is_private: false,
              is_active: true
            }
          }
        ]
      };

      mockListingModel.aggregate.mockResolvedValue([mockListing]);

      await get_listing_by_id_endpoint(mockRequest, mockReply);

      // Verify the response
      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'listings',
            id: '64abc123def456789012345',
            attributes: expect.objectContaining({
              name: 'Test Listing',
              description: 'A test listing'
            }),
            relationships: expect.objectContaining({
              bookmarks: expect.objectContaining({
                data: expect.arrayContaining([
                  expect.objectContaining({
                    type: 'bookmarks',
                    id: '64abc789def012345678901'
                  })
                ])
              })
            })
          }),
          included: expect.arrayContaining([
            expect.objectContaining({
              type: 'bookmarks',
              id: '64abc789def012345678901',
              attributes: expect.objectContaining({
                title: 'Test Bookmark',
                platform: 'youtube'
              })
            })
          ])
        })
      );
    });

    it('should return listing without bookmarks when no bookmarks exist', async () => {
      const mockListing = {
        _id: new Types.ObjectId('64abc123def456789012345'),
        name: 'Empty Listing',
        is_active: true,
        is_private: false,
        user_id: 'user123',
        created_at: new Date(),
        modified_at: new Date(),
        bookmarks: []
      };

      mockListingModel.aggregate.mockResolvedValue([mockListing]);

      await get_listing_by_id_endpoint(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: 'listings',
            id: '64abc123def456789012345'
          })
        })
      );
    });
  });

  describe('Error responses', () => {
    it('should return 400 for invalid ObjectId format', async () => {
      mockRequest.params.id = 'invalid-id';

      await get_listing_by_id_endpoint(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              status: '400',
              title: 'Bad Request',
              detail: "Invalid listing ID format: 'invalid-id'"
            })
          ])
        })
      );
    });

    it('should return 404 when listing not found', async () => {
      mockListingModel.aggregate.mockResolvedValue([]);

      await get_listing_by_id_endpoint(mockRequest, mockReply);

      expect(mockReply.code).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.objectContaining({
              status: '404',
              title: 'Not Found',
              detail: "Listing with id '64abc123def456789012345' not found."
            })
          ])
        })
      );
    });

    it('should return 500 on database error', async () => {
      const dbError = new Error('Database connection failed');
      mockListingModel.aggregate.mockRejectedValue(dbError);

      await get_listing_by_id_endpoint(mockRequest, mockReply);

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

  describe('Aggregation pipeline', () => {
    it('should call aggregate with correct pipeline structure', async () => {
      const mockListing = {
        _id: new Types.ObjectId('64abc123def456789012345'),
        name: 'Test Listing',
        bookmarks: []
      };

      mockListingModel.aggregate.mockResolvedValue([mockListing]);

      await get_listing_by_id_endpoint(mockRequest, mockReply);

      // Verify that aggregate was called with proper pipeline stages
      expect(mockListingModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          // Match stage
          expect.objectContaining({
            $match: expect.objectContaining({
              _id: expect.any(Types.ObjectId),
              is_active: true
            })
          }),
          // Lookup stage
          expect.objectContaining({
            $lookup: expect.objectContaining({
              from: 'bookmarks',
              as: 'populated_bookmarks'
            })
          }),
          // Project stage
          expect.objectContaining({
            $project: expect.objectContaining({
              restrict: 0,
              rules: 0,
              __v: 0
            })
          })
        ])
      );
    });
  });
});
