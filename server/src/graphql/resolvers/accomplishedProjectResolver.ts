import {
  createAccomplishedProject,
  deleteAccomplishedProject,
  getAllAccomplishedProjects,
  getAccomplishedProjectById,
  getAccomplishedProjectsByProjectId,
  updateAccomplishedProject,
} from "../../services/accomplishedProjectService";

export const accomplishedProjectResolvers = {
  Query: {
    accomplishedProjects: async () => {
      return await getAllAccomplishedProjects();
    },
    accomplishedProject: async (_: any, { id }: { id: string }) => {
      return await getAccomplishedProjectById(id);
    },
    accomplishedProjectsByProjectId: async (
      _: any,
      { projectId }: { projectId: string }
    ) => {
      return await getAccomplishedProjectsByProjectId(projectId);
    },
  },
  Mutation: {
    createAccomplishedProject: async (
      _: any,
      { project }: { project: any }
    ) => {
      return await createAccomplishedProject(project);
    },
    updateAccomplishedProject: async (
      _: any,
      { id, project }: { id: string; project: any }
    ) => {
      return await updateAccomplishedProject(id, project);
    },
    deleteAccomplishedProject: async (_: any, { id }: { id: string }) => {
      return await deleteAccomplishedProject(id);
    },
  },
};