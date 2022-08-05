import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ErrorType = {
  __typename?: 'ErrorType';
  field?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login: UserResponse;
  register: UserResponse;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: UserInput;
};

export type Query = {
  __typename?: 'Query';
  getByUsername?: Maybe<User>;
  me?: Maybe<UserResponse>;
};


export type QueryGetByUsernameArgs = {
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<ErrorType>;
  user?: Maybe<User>;
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', email: string, username: string, updatedAt: string, id: string, createdAt: string } | null } };

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', email: string, username: string, updatedAt: string, id: string, createdAt: string } | null } };

export type GetByUsernameQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type GetByUsernameQuery = { __typename?: 'Query', getByUsername?: { __typename?: 'User', id: string, username: string, email: string, createdAt: string, updatedAt: string } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', email: string, username: string, updatedAt: string, id: string, createdAt: string } | null } | null };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    error {
      field
      message
    }
    user {
      email
      username
      updatedAt
      id
      createdAt
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($input: UserInput!) {
  register(input: $input) {
    error {
      field
      message
    }
    user {
      email
      username
      updatedAt
      id
      createdAt
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const GetByUsernameDocument = gql`
    query GetByUsername($username: String!) {
  getByUsername(username: $username) {
    id
    username
    email
    createdAt
    updatedAt
  }
}
    `;

export function useGetByUsernameQuery(options: Omit<Urql.UseQueryArgs<GetByUsernameQueryVariables>, 'query'>) {
  return Urql.useQuery<GetByUsernameQuery>({ query: GetByUsernameDocument, ...options });
};
export const GetMeDocument = gql`
    query GetMe {
  me {
    error {
      field
      message
    }
    user {
      email
      username
      updatedAt
      id
      createdAt
    }
  }
}
    `;

export function useGetMeQuery(options?: Omit<Urql.UseQueryArgs<GetMeQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMeQuery>({ query: GetMeDocument, ...options });
};