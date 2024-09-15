import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from '../common/decorator/UserId';
import { TokenAccessGuard } from '../common/guard/token-access.guard';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

@ApiBearerAuth()
@ApiTags('Borrow')
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @UseGuards(TokenAccessGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new borrowing' })
  @ApiResponse({
    status: 200,
    description: 'Successfully created borrowing',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: { id: '550e8400-e29b-41d4-a716-446655440000' },
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden if the member is penalized or book is out of stock or already borrowed',
  })
  @ApiNotFoundResponse({
    description: 'Not Found if user or book does not exist',
  })
  async create(
    @UserId() userId: string,
    @Body() createBorrowDto: CreateBorrowDto,
  ) {
    return this.borrowService.createBorrow(userId, createBorrowDto);
  }

  @UseGuards(TokenAccessGuard)
  @Post('returned')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiResponse({
    status: 200,
    description: 'Successfully returned borrowing',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: { id: '550e8400-e29b-41d4-a716-446655440000' },
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden if the book was not borrowed by the user or return is overdue',
  })
  @ApiNotFoundResponse({
    description: 'Not Found if borrowing record does not exist',
  })
  async createReturned(
    @UserId() userId: string,
    @Body() createBorrowDto: CreateBorrowDto,
  ) {
    return await this.borrowService.createReturn(userId, createBorrowDto);
  }
}
