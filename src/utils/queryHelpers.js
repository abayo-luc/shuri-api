import sequelize from 'sequelize';
import searchable from './searchable';

const { Op } = sequelize;

export const paginate = (page = 1, limit = 50) => {
  const offset = (Number(page) - 1) * limit;
  return { offset, limit };
};
export const textSearch = (text, type) => {
  if (text) {
    return {
      where: {
        [Op.or]: searchable[type].map(item => ({
          [item]: {
            [Op.iLike]: `%${text}%`
          }
        }))
      }
    };
  }
  return {};
};
