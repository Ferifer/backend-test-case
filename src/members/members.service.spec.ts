import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MembersEntity } from './entities/member.entity';
import { HttpStatus } from '@nestjs/common';
import { GetListMemberDto } from './dto/get-members.dto';

// Mock UUIDs
const uuid1 = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const uuid2 = 'f47ac10b-58cc-4372-a567-0e02b2c3d480';
const uuid3 = 'f47ac10b-58cc-4372-a567-0e02b2c3d481';

// Mock data
const members = [
  {
    id: uuid1,
    code: 'M001',
    name: 'Alice',
    borrowings: [{ id: uuid1 }, { id: uuid2 }],
  },
  {
    id: uuid2,
    code: 'M002',
    name: 'Bob',
    borrowings: [{ id: uuid3 }],
  },
  {
    id: uuid3,
    code: 'M003',
    name: 'Charlie',
    borrowings: [],
  },
];

describe('MembersService', () => {
  let service: MembersService;
  let memberRepo: Repository<MembersEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(MembersEntity),
          useValue: {
            findAndCount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepo = module.get<Repository<MembersEntity>>(
      getRepositoryToken(MembersEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated list of members with borrowed books count', async () => {
      const reqDto: GetListMemberDto = { page: 1, per_page: 10 };

      (memberRepo.findAndCount as jest.Mock).mockResolvedValue([
        members,
        members.length,
      ]);

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [
            { id: uuid1, code: 'M001', name: 'Alice', total_borrowed_books: 2 },
            { id: uuid2, code: 'M002', name: 'Bob', total_borrowed_books: 1 },
            {
              id: uuid3,
              code: 'M003',
              name: 'Charlie',
              total_borrowed_books: 0,
            },
          ],
          metadata: {
            page: 1,
            per_page: 10,
            total: 3,
          },
        },
      });
    });

    it('should handle pagination correctly', async () => {
      const reqDto: GetListMemberDto = { page: 2, per_page: 2 };

      (memberRepo.findAndCount as jest.Mock).mockResolvedValue([
        [members[2]], // Only Charlie should be in the second page
        members.length,
      ]);

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [
            {
              id: uuid3,
              code: 'M003',
              name: 'Charlie',
              total_borrowed_books: 0,
            },
          ],
          metadata: {
            page: 2,
            per_page: 2,
            total: 3,
          },
        },
      });
    });

    it('should filter members by name', async () => {
      const reqDto: GetListMemberDto = { name: 'Alice', page: 1, per_page: 10 };

      (memberRepo.findAndCount as jest.Mock).mockResolvedValue([
        [members[0]], // Only Alice matches
        1,
      ]);

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [
            { id: uuid1, code: 'M001', name: 'Alice', total_borrowed_books: 2 },
          ],
          metadata: {
            page: 1,
            per_page: 10,
            total: 1,
          },
        },
      });
    });

    it('should filter members by code', async () => {
      const reqDto: GetListMemberDto = { code: 'M002', page: 1, per_page: 10 };

      (memberRepo.findAndCount as jest.Mock).mockResolvedValue([
        [members[1]], // Only Bob matches
        1,
      ]);

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [
            { id: uuid2, code: 'M002', name: 'Bob', total_borrowed_books: 1 },
          ],
          metadata: {
            page: 1,
            per_page: 10,
            total: 1,
          },
        },
      });
    });

    it('should handle no results found', async () => {
      const reqDto: GetListMemberDto = {
        name: 'Nonexistent',
        page: 1,
        per_page: 10,
      };

      (memberRepo.findAndCount as jest.Mock).mockResolvedValue([
        [], // No members found
        0,
      ]);

      const result = await service.findAll(reqDto);

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Success',
        data: {
          list: [],
          metadata: {
            page: 1,
            per_page: 10,
            total: 0,
          },
        },
      });
    });
  });
});
