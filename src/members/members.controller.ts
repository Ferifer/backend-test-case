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
import { BadRequestExcp } from '../common/exception/bad-request.excp';
import { TokenAccessGuard } from '../common/guard/token-access.guard';
import { CreateMemberDto } from './dto/create-member.dto';
import { FindAllMembersResponseDto } from './dto/find-all-members-response.dto';
import { GetListMemberDto } from './dto/get-members.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';

@ApiBearerAuth()
@ApiTags('Members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // @UseGuards(TokenAccessGuard)
  @Get()
  @ApiOperation({ summary: 'get list members' })
  @ApiResponse({
    status: 200,
    description: 'Successful retrieval of members',
    type: FindAllMembersResponseDto,
  })
  async findAll(@Query() reqDto: GetListMemberDto) {
    return this.membersService.findAll(reqDto);
  }

  @UseGuards(TokenAccessGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'Member created successfully.' })
  @ApiBody({ type: CreateMemberDto })
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    try {
      const newMember = await this.membersService.createMember(createMemberDto);
      return {
        status: HttpStatus.CREATED,
        message: 'Member successfully created',
        data: newMember,
      };
    } catch (error) {
      throw new BadRequestExcp(error.message);
    }
  }

  @UseGuards(TokenAccessGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get member details by ID' })
  @ApiResponse({
    status: 200,
    description: 'Member details fetched successfully.',
  })
  @ApiParam({ name: 'id', description: 'Member ID' })
  async getMember(@Param('id') id: string) {
    const member = await this.membersService.getMemberById(id);

    return new ResponseDefaultDto({ data: member });
  }

  @UseGuards(TokenAccessGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update member details' })
  @ApiResponse({ status: 200, description: 'Member updated successfully.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiBody({ type: UpdateMemberDto })
  async updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: UpdateMemberDto,
  ) {
    const updatedMember = await this.membersService.updateMember(
      id,
      updateMemberDto,
    );
    return new ResponseDefaultDto({
      message: 'Member successfully updated',
      data: updatedMember,
    });
  }

  @UseGuards(TokenAccessGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a member' })
  @ApiResponse({ status: 200, description: 'Member deleted successfully.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  async deleteMember(@Param('id') id: string) {
    const data = await this.membersService.deleteMember(id);
    return new ResponseDefaultDto({
      message: 'Member successfully deleted',
      data: data,
    });
  }
}
