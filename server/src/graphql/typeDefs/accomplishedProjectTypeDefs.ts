import { gql } from "apollo-server-express";

export const accomplishedProjectTypeDefs = gql`
  enum PropertyType {
    HOME
    COMMERCIAL
    FARM
  }

  enum CoolerType {
    IRANI
    CENTRAL
  }

  enum InverterLocation {
    INSIDE
    OUTSIDE
  }

  type AccomplishedProject {
    id: ID!
    propertyType: PropertyType!
    nightAmperage: Float
    dayAmperage: Float
    numberOfSplits: Int
    numberOfFridges: Int
    numberOfFreezers: Int
    numberOfCoolers: Int
    coolerType: CoolerType
    numberOfColdRooms: Int
    propertyArea: Float
    isRoofExposed: Boolean
    inverterLocation: InverterLocation!
    numberOfFloors: Int
    numberOfFamilies: Int
    projectId: ID!
    createdAt: String!
    updatedAt: String!
  }

  input AccomplishedProjectInput {
    propertyType: PropertyType!
    nightAmperage: Float
    dayAmperage: Float
    numberOfSplits: Int
    numberOfFridges: Int
    numberOfFreezers: Int
    numberOfCoolers: Int
    coolerType: CoolerType
    numberOfColdRooms: Int
    propertyArea: Float
    isRoofExposed: Boolean
    inverterLocation: InverterLocation!
    numberOfFloors: Int
    numberOfFamilies: Int
    projectId: ID!
  }

  input UpdateAccomplishedProjectInput {
    propertyType: PropertyType
    nightAmperage: Float
    dayAmperage: Float
    numberOfSplits: Int
    numberOfFridges: Int
    numberOfFreezers: Int
    numberOfCoolers: Int
    coolerType: CoolerType
    numberOfColdRooms: Int
    propertyArea: Float
    isRoofExposed: Boolean
    inverterLocation: InverterLocation
    numberOfFloors: Int
    numberOfFamilies: Int
  }

  type Query {
    accomplishedProjects: [AccomplishedProject!]!
    accomplishedProject(id: ID!): AccomplishedProject
    accomplishedProjectsByProjectId(projectId: ID!): [AccomplishedProject!]!
  }

  type Mutation {
    createAccomplishedProject(
      project: AccomplishedProjectInput!
    ): AccomplishedProject!
    updateAccomplishedProject(
      id: ID!
      project: UpdateAccomplishedProjectInput!
    ): AccomplishedProject!
    deleteAccomplishedProject(id: ID!): String!
  }
`;