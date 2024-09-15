import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDefaultDto } from '../common/dto/response-default.dto';
import { BooksService } from './books.service';
import { CreateBookDto, CreateBookResponseDto } from './dto/create-book.dto';
import { GetListBookDto } from './dto/get-book.dto';
import { UpdateBookDto, UpdateBookResponseDto } from './dto/update-book.dto';
import { FindAllBooksResponseDto } from './dto/find-all-books-response.dto';
import { TokenAccessGuard } from '../common/guard/token-access.guard';

@ApiBearerAuth()
@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(TokenAccessGuard)
  @Get()
  @ApiOperation({ summary: 'Get list of book' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List Of Book',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            code: 'ABC123',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            stock: 5,
          },
        ],
      },
    },
    type: FindAllBooksResponseDto,
  })
  async findAll(@Query() reqDto: GetListBookDto) {
    return await this.booksService.findAll(reqDto);
  }

  @UseGuards(TokenAccessGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Book successfully created',
    schema: {
      example: {
        status: 201,
        message: 'Success',
        data: {
          id: 'ce8c59c1-3707-4432-9fbc-641f3ae0743d',
          code: 'B0012',
          title: 'The Catcher in the Rye V1',
          author: 'J.D. Salinger',
          stock: 11,
        },
        timestamp: 1726372821879,
      },
    },
    type: CreateBookResponseDto,
  })
  @ApiBody({ type: CreateBookDto })
  async create(@Body() createBookDto: CreateBookDto) {
    const response = await this.booksService.createBook(createBookDto);
    return new ResponseDefaultDto({
      status: HttpStatus.CREATED,
      data: response,
    });
  }

  @UseGuards(TokenAccessGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get book details by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book successfully get detail',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: {
          code: 'B0012',
          title: 'The Catcher in the Rye V1',
          author: 'J.D. Salinger',
          stock: 11,
          id: 'ce8c59c1-3707-4432-9fbc-641f3ae0743d',
        },
        timestamp: 1726372589065,
      },
    },
    type: CreateBookResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Book ID', required: true })
  async findOne(@Param('id') id: string) {
    const response = await this.booksService.getBookDetail(id);
    return new ResponseDefaultDto({ data: response });
  }

  @UseGuards(TokenAccessGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book successfully updated',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: {
          id: 'ce8c59c1-3707-4432-9fbc-641f3ae0743d',
          code: 'B0012',
          title: 'The Catcher in the Rye V1',
          author: 'J.D. Salinger',
          stock: 11,
        },
        timestamp: 1726372821879,
      },
    },
    type: UpdateBookResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Book ID', required: true })
  @ApiBody({ type: UpdateBookDto })
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    const response = await this.booksService.updateBook(id, updateBookDto);
    return new ResponseDefaultDto({ data: response });
  }

  @UseGuards(TokenAccessGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Book successfully deleted',
    schema: {
      example: {
        status: 200,
        message: 'Success',
        data: {
          id: 'ce8c59c1-3707-4432-9fbc-641f3ae0743d',
          code: 'B0012',
          title: 'The Catcher in the Rye V1',
          author: 'J.D. Salinger',
          stock: 11,
        },
        timestamp: 1726372821879,
      },
    },
    type: CreateBookResponseDto,
  })
  @ApiParam({ name: 'id', description: 'Book ID', required: true })
  async remove(@Param('id') id: string) {
    const response = await this.booksService.deleteBook(id);
    return new ResponseDefaultDto({ data: response });
  }
}
