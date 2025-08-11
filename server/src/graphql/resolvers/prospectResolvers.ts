import { ProspectService } from '../../services/prospectService';
const prospectService = new ProspectService();

export const prospectResolvers = {
  ContactStatus: {
    NOT_CONTACTED: 'not_contacted',
    CONTACTED: 'contacted',
    CLOSED: 'closed'
  },
  
  Query: {
    getAllProspects: () => prospectService.getAllProspects(),
    getProspectById: (_: any, { id }: { id: number }) => prospectService.getProspectById(id),
    getProspectsByStatus: (_: any, { status }: { status: 'not_contacted' | 'contacted' | 'closed' }) => 
      prospectService.getProspectsByStatus(status),
    searchProspects: (_: any, { keyword }: { keyword: string }) =>
      prospectService.searchProspects(keyword)
  },

  Mutation: {
    createProspect: (_: any, { input }: { input: any }) => prospectService.createProspect(input),
    updateProspect: (_: any, { id, input }: { id: number, input: any }) => 
      prospectService.updateProspect(id, input),
    deleteProspect: (_: any, { id }: { id: number }) => prospectService.deleteProspect(id)
  }
};