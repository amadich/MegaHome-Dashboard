import AccomplishedProject from "../models/AccomplishedProjectModel";

export const getAllAccomplishedProjects = async () => {
  return await AccomplishedProject.findAll();
};

export const getAccomplishedProjectById = async (id: string) => {
  const project = await AccomplishedProject.findByPk(id);
  if (!project) throw new Error("Accomplished project not found");
  return project;
};

export const getAccomplishedProjectsByProjectId = async (projectId: string) => {
  return await AccomplishedProject.findAll({ where: { projectId } });
};

export const createAccomplishedProject = async (projectData: any) => {
  return await AccomplishedProject.create(projectData);
};

export const updateAccomplishedProject = async (
  id: string,
  projectData: any
) => {
  const project = await AccomplishedProject.findByPk(id);
  if (!project) throw new Error("Accomplished project not found");
  await project.update(projectData);
  return project;
};

export const deleteAccomplishedProject = async (id: string) => {
  const project = await AccomplishedProject.findByPk(id);
  if (!project) throw new Error("Accomplished project not found");
  await project.destroy();
  return "Accomplished project deleted successfully";
};