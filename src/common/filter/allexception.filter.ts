import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
import { EntityNotFoundError } from 'typeorm';
import { CommandPrerequisitesException } from '../exception/commandprerequiesites.exception';
import { InvalidAuthenticationException } from '../exception/invalidauthentication.exception';
import { isValidJson } from '../util/isvalidjson';

import { Request } from 'express';
import { ResponseDefaultDto } from '../dto/response-default.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionFilter.name);
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void | Observable<void> {
    //call context
    const ctxType = host.getType();
    switch (ctxType) {
      case 'http': {
        this.handleHttpContextErr(exception, host);
        break;
      }
      default: {
        this.logger.error(exception);
        break;
      }
    }
  }
  private handleHttpContextErr(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    this.logger.error(
      `Exception occurred on request ${req.method} ${req.url} - ${
        (exception as Error)?.stack
      }`,
    );

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';
    let errors =
      exception instanceof HttpException
        ? [exception.message]
        : ['Check log for detailed information'];

    if (exception instanceof InternalServerErrorException) {
      const response = exception.getResponse();
      if (response) {
        message = response['error'];
        errors = Array.isArray(response['message'])
          ? response['message']
          : [response['message']];
      }
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

      const respBody = new ResponseDefaultDto({
        status: httpStatus,
        message: message,
        data: null,
        errors: errors,
      });

      return httpAdapter.reply(ctx.getResponse(), respBody, httpStatus);
    }

    if (
      exception.message.includes(
        'path must be absolute or specify root to res.sendFile',
      )
    ) {
      const req = ctx.getRequest<Request>();
      const urlAccess = `${req.protocol}://${req.get('Host')}${req.url}`;
      message = `${urlAccess} Not Found`;
      errors = [];
      errors.push(`${urlAccess} Not Found`);
      httpStatus = HttpStatus.NOT_FOUND;

      const respBody = new ResponseDefaultDto({
        status: httpStatus,
        message: message,
        data: null,
        errors: errors,
      });

      return httpAdapter.reply(ctx.getResponse(), respBody, httpStatus);
    }

    if (
      exception.message.includes(
        "Data types don't match: Series of dtype: Date != Utf8",
      )
    ) {
      message = 'Request Constraint Violation';
      errors = ["Data types don't match: Series of dtype: Date != String"];
      httpStatus = HttpStatus.BAD_REQUEST;

      const respBody = new ResponseDefaultDto({
        status: httpStatus,
        message: message,
        data: null,
        errors: errors,
      });

      return httpAdapter.reply(ctx.getResponse(), respBody, httpStatus);
    }

    if (exception instanceof CommandPrerequisitesException) {
      httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
      message = 'Command Prerequisites Error';
      errors.push(exception.message);
    } else if (exception instanceof InvalidAuthenticationException) {
      httpStatus = exception.getStatus();
      message = 'Invalid Authentication';
      errors.push(exception.message);
    } else if (exception instanceof UnauthorizedException) {
      httpStatus = exception.getStatus();
      message = 'Action Not Allowed';
      errors.push(exception.message);
    } else if (exception instanceof BadRequestException) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = 'Request Constraint Violation';
      const respObj = exception.getResponse() as object;
      const validationMsg = respObj['message'];
      if (Array.isArray(validationMsg)) {
        errors = [...validationMsg];
      } else {
        errors.push(validationMsg);
      }
    } else if (
      exception instanceof EntityNotFoundError ||
      exception instanceof NotFoundException
    ) {
      message = exception.message;
      httpStatus = HttpStatus.NOT_FOUND;
    } else if (exception instanceof Error) {
      message = exception.message;
      httpStatus = HttpStatus.AMBIGUOUS;
    } else if (exception.error) {
      let errResp = exception.error;
      if (isValidJson(errResp)) errResp = JSON.parse(errResp);
      message = errResp.msg || errResp.message || 'Internal sever error';
      httpStatus = errResp.code || 500;
      errors = [message];
      if (errResp.code == 422) message = 'Command Prerequisites Error';
    } else if (isValidJson(exception.message)) {
      this.logger.error(exception.message);
      const jsonErr = JSON.parse(exception.message);
      httpStatus = jsonErr['code'] || httpStatus;
      message = jsonErr['msg'];
    }
    if (httpStatus == HttpStatus.AMBIGUOUS) {
      httpStatus = exception.status || HttpStatus.BAD_REQUEST;
      if (exception && exception.response && exception.response.errors) {
        errors = exception.response.errors;
      }
    }

    const respBody = new ResponseDefaultDto({
      status: httpStatus,
      message: message,
      data: null,
      errors: errors,
    });

    httpAdapter.reply(ctx.getResponse(), respBody, httpStatus);
  }
}
