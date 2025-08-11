import { gql } from "apollo-server-express";

export const prospectTypeDefs = gql`
  enum ContactStatus {
    NOT_CONTACTED
    CONTACTED
    CLOSED
  }

  type Prospect {
    id: ID!
    fullName: String!
    phone: String!
    address: String!
    contactStatus: ContactStatus!
  }

  input CreateProspectInput {
    fullName: String!
    phone: String!
    address: String!
    contactStatus: ContactStatus
  }

  input UpdateProspectInput {
    fullName: String
    phone: String
    address: String
    contactStatus: ContactStatus
  }

  type Query {
    getAllProspects: [Prospect!]!
    getProspectById(id: ID!): Prospect
    getProspectsByStatus(status: ContactStatus!): [Prospect!]!
    searchProspects(keyword: String!): [Prospect!]!
  }

  type Mutation {
    createProspect(input: CreateProspectInput!): Prospect!
    updateProspect(id: ID!, input: UpdateProspectInput!): Prospect!
    deleteProspect(id: ID!): Boolean!
  }
`;