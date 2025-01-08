export interface ILoadingState {
    loading: boolean; 
}

export interface DecodedToken{
    name: string
    email: string
  }

  export interface IApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}


export interface BlockedUserMessage {
  email: string; 
}

export interface User {
  email: string;
}
