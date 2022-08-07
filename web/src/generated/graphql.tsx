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

export type ActorType = {
  __typename?: 'ActorType';
  actorImage?: Maybe<Scalars['String']>;
  actorName?: Maybe<Scalars['String']>;
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

export type MovieType = {
  __typename?: 'MovieType';
  movieImage?: Maybe<Scalars['String']>;
  movieName?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  getUserCurrentGameResults: QuizResultResponse;
  login: UserResponse;
  logout: UserResponse;
  register: UserResponse;
};


export type MutationGetUserCurrentGameResultsArgs = {
  input: Array<UserQuizResponseInput>;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: UserInput;
};

export type Query = {
  __typename?: 'Query';
  getAllUserGameResults?: Maybe<UserResultResponse>;
  getByUsername?: Maybe<User>;
  getGameQuestion?: Maybe<QuizResponse>;
  me?: Maybe<UserResponse>;
};


export type QueryGetByUsernameArgs = {
  username: Scalars['String'];
};

export type QuizResponse = {
  __typename?: 'QuizResponse';
  error?: Maybe<ErrorType>;
  quiz?: Maybe<QuizType>;
};

export type QuizResult = {
  __typename?: 'QuizResult';
  createdAt?: Maybe<Scalars['String']>;
  currentScore?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  noCorrectAnswers?: Maybe<Scalars['Float']>;
  totalAnsweredQuestions?: Maybe<Scalars['Float']>;
  updatedAt?: Maybe<Scalars['String']>;
  user: User;
  userId: Scalars['String'];
};

export type QuizResultResponse = {
  __typename?: 'QuizResultResponse';
  error?: Maybe<ErrorType>;
  result?: Maybe<QuizResult>;
};

export type QuizType = {
  __typename?: 'QuizType';
  actor?: Maybe<ActorType>;
  id?: Maybe<Scalars['String']>;
  movie?: Maybe<MovieType>;
};

export type User = {
  __typename?: 'User';
  accessToken?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  email: Scalars['String'];
  highestScore?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  quizResult: Array<QuizResult>;
  updatedAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserQuizResponseInput = {
  questionId: Scalars['String'];
  response: Scalars['Boolean'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<ErrorType>;
  user?: Maybe<User>;
};

export type UserResultResponse = {
  __typename?: 'UserResultResponse';
  error?: Maybe<ErrorType>;
  result?: Maybe<Array<QuizResult>>;
};

export type ErrorFragmentFragment = { __typename?: 'ErrorType', field?: string | null, message: string };

export type UserFragmentFragment = { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> };

export type RegisterMutationVariables = Exact<{
  input: UserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> } | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> } | null } };

export type LogoutMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> } | null } };

export type GetUserQuizResponseMutationVariables = Exact<{
  input: Array<UserQuizResponseInput> | UserQuizResponseInput;
}>;


export type GetUserQuizResponseMutation = { __typename?: 'Mutation', getUserCurrentGameResults: { __typename?: 'QuizResultResponse', error?: { __typename?: 'ErrorType', message: string, field?: string | null } | null, result?: { __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, totalAnsweredQuestions?: number | null, currentScore?: number | null, updatedAt?: string | null, createdAt?: string | null, user: { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> } } | null } };

export type GetGameQuestionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGameQuestionQuery = { __typename?: 'Query', getGameQuestion?: { __typename?: 'QuizResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, quiz?: { __typename?: 'QuizType', id?: string | null, movie?: { __typename?: 'MovieType', movieImage?: string | null, movieName?: string | null } | null, actor?: { __typename?: 'ActorType', actorImage?: string | null, actorName?: string | null } | null } | null } | null };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'UserResponse', error?: { __typename?: 'ErrorType', field?: string | null, message: string } | null, user?: { __typename?: 'User', id: string, username: string, email: string, accessToken?: string | null, highestScore?: number | null, createdAt: string, updatedAt: string, quizResult: Array<{ __typename?: 'QuizResult', id?: string | null, noCorrectAnswers?: number | null, currentScore?: number | null, createdAt?: string | null, updatedAt?: string | null, totalAnsweredQuestions?: number | null }> } | null } | null };

export const ErrorFragmentFragmentDoc = gql`
    fragment ErrorFragment on ErrorType {
  field
  message
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  username
  email
  accessToken
  highestScore
  createdAt
  updatedAt
  quizResult {
    id
    noCorrectAnswers
    currentScore
    createdAt
    updatedAt
    totalAnsweredQuestions
  }
}
    `;
export const RegisterDocument = gql`
    mutation Register($input: UserInput!) {
  register(input: $input) {
    error {
      field
      message
    }
    user {
      id
      username
      email
      accessToken
      highestScore
      createdAt
      updatedAt
      quizResult {
        id
        noCorrectAnswers
        currentScore
        createdAt
        updatedAt
        totalAnsweredQuestions
      }
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    error {
      field
      message
    }
    user {
      id
      username
      email
      accessToken
      highestScore
      createdAt
      updatedAt
      quizResult {
        id
        noCorrectAnswers
        currentScore
        createdAt
        updatedAt
        totalAnsweredQuestions
      }
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout($input: LoginInput!) {
  logout {
    error {
      field
      message
    }
    user {
      id
      username
      email
      accessToken
      highestScore
      createdAt
      updatedAt
      quizResult {
        id
        noCorrectAnswers
        currentScore
        createdAt
        updatedAt
        totalAnsweredQuestions
      }
    }
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const GetUserQuizResponseDocument = gql`
    mutation GetUserQuizResponse($input: [UserQuizResponseInput!]!) {
  getUserCurrentGameResults(input: $input) {
    error {
      message
      field
    }
    result {
      id
      noCorrectAnswers
      totalAnsweredQuestions
      currentScore
      updatedAt
      createdAt
      user {
        ...UserFragment
      }
    }
  }
}
    ${UserFragmentFragmentDoc}`;

export function useGetUserQuizResponseMutation() {
  return Urql.useMutation<GetUserQuizResponseMutation, GetUserQuizResponseMutationVariables>(GetUserQuizResponseDocument);
};
export const GetGameQuestionDocument = gql`
    query GetGameQuestion {
  getGameQuestion {
    error {
      field
      message
    }
    quiz {
      id
      movie {
        movieImage
        movieName
      }
      actor {
        actorImage
        actorName
      }
    }
  }
}
    `;

export function useGetGameQuestionQuery(options?: Omit<Urql.UseQueryArgs<GetGameQuestionQueryVariables>, 'query'>) {
  return Urql.useQuery<GetGameQuestionQuery>({ query: GetGameQuestionDocument, ...options });
};
export const GetMeDocument = gql`
    query GetMe {
  me {
    error {
      ...ErrorFragment
    }
    user {
      ...UserFragment
    }
  }
}
    ${ErrorFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;

export function useGetMeQuery(options?: Omit<Urql.UseQueryArgs<GetMeQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMeQuery>({ query: GetMeDocument, ...options });
};