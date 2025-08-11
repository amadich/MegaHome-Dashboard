import { Prospect } from '../models/ProspectModel';
import { Op } from 'sequelize';

export class ProspectService {
  async getAllProspects() {
    return await Prospect.findAll();
  }

  async getProspectById(id: number) {
    return await Prospect.findByPk(id);
  }

  async getProspectsByStatus(status: 'not_contacted' | 'contacted' | 'closed') {
    return await Prospect.findAll({ where: { contactStatus: status } });
  }

  async searchProspects(keyword: string) {
    return await Prospect.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { address: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  async createProspect(input: any) {
    return await Prospect.create({
      ...input,
      contactStatus: input.contactStatus || 'not_contacted'
    });
  }

  async updateProspect(id: number, input: any) {
    const prospect = await Prospect.findByPk(id);
    if (!prospect) throw new Error('Prospect not found');
    return await prospect.update(input);
  }

  async deleteProspect(id: number) {
    const prospect = await Prospect.findByPk(id);
    if (!prospect) throw new Error('Prospect not found');
    await prospect.destroy();
    return true;
  }
}