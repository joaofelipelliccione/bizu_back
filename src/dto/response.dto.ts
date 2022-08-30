class BasicResponse {
  statusCode: number;
}

export class GenericResponseDto extends BasicResponse {
  statusCode: number;
  message: string;
}

export class TokenResponseDto extends BasicResponse {
  statusCode: number;
  accessToken: string;
}
