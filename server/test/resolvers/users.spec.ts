/// <reference types="@types/jest" />;

import users from "../data/users";
import { graphQLRequest } from "../utils/graphqlRequest";
import { BaseEntity } from "typeorm";
import axios from "axios";

afterAll(() => {
  jest.clearAllMocks();
});

describe("user resolvers", () => {
  it("should check if server health is ok", async () => {
    try {
      const response = await axios.get(`${process.env.BACK_END_URL}health`);
      expect(response.data).toEqual("Ok");
    } catch (error) {
      console.log("Checking server status returned an error ", error.message);
    }
  });

  it("should register new user", async () => {
    const data = users[0];
    const mockSave = jest.fn().mockResolvedValue(data);
    const mockCreate = jest.fn().mockReturnThis();
    BaseEntity.create = mockCreate;
    BaseEntity.save = mockSave;

    const mutation = `
    mutation register($input: UserInput!) {
      register(input: $input){
        error {
          field,
          message
        }
        user {
          email
          username
        }
      }
    }
    `;
    const variables = {
      input: data,
    };

    const response = await graphQLRequest({
      source: mutation,
      variableValues: variables,
    });

    const expected = {
      data: {
        register: {
          error: null,
          user: variables.input,
        },
      },
    };

    expect(response).toMatchObject(expected);
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledTimes(1);
  });

  it("should login a user", async () => {
    const data = users[0];

    const mockFindOne = jest.fn().mockResolvedValue(data);
    BaseEntity.findOne = mockFindOne;
    const query = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        error {
          field,
          message
        }
        user {
          email
          username
        }
      }
    }
    `;
    const variables = {
      input: {
        email: data.email,
        password: data.password,
      },
    };

    const response = await graphQLRequest({
      source: query,
      variableValues: variables,
    });

    const expected = {
      data: {
        login: {
          error: null,
          user: {
            email: data.email,
            username: data.username,
          },
        },
      },
    };

    expect(response).toMatchObject(expected);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { email: data.email },
    });
  });

  it("should find the user by it's username", async () => {
    const data = users[0];

    const mockFindOne = jest.fn().mockResolvedValue(data);
    BaseEntity.findOne = mockFindOne;
    const query = `
    query GetByUsername($username: String!) {
      getByUsername(username: $username) {
        username
        email
      }
    }
    `;
    const variables = {
      username: data.username,
    };

    const response = await graphQLRequest({
      source: query,
      variableValues: variables,
    });

    const expected = {
      data: {
        getByUsername: {
          email: data.email,
          username: data.username,
        },
      },
    };

    expect(response).toMatchObject(expected);
    expect(mockFindOne).toHaveBeenCalledTimes(1);
    expect(mockFindOne).toHaveBeenCalledWith({
      where: { username: data.username },
    });
  });
});
