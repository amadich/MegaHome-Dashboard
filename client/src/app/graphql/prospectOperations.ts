import { gql } from "@apollo/client";

export const GET_ALL_PROSPECTS = gql`
  query GetAllProspects {
    getAllProspects {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const GET_PROSPECT_BY_ID = gql`
  query GetProspectById($id: ID!) {
    getProspectById(id: $id) {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const SEARCH_PROSPECTS = gql`
  query SearchProspects($keyword: String!) {
    searchProspects(keyword: $keyword) {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const GET_PROSPECTS_BY_STATUS = gql`
  query GetProspectsByStatus($status: ContactStatus!) {
    getProspectsByStatus(status: $status) {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const CREATE_PROSPECT = gql`
  mutation CreateProspect($input: CreateProspectInput!) {
    createProspect(input: $input) {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const UPDATE_PROSPECT = gql`
  mutation UpdateProspect($id: ID!, $input: UpdateProspectInput!) {
    updateProspect(id: $id, input: $input) {
      id
      fullName
      phone
      address
      contactStatus
    }
  }
`;

export const DELETE_PROSPECT = gql`
  mutation DeleteProspect($id: ID!) {
    deleteProspect(id: $id)
  }
`;