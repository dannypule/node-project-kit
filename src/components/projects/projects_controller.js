import { formatFromDb, formatForDb } from './projects_service';
import utils from '../../utils';

export default class ProjectsController {
  constructor(model) {
    this.model = model;
  }

  getProjects = async (req, res) => {
    try {
      const limit = 15; // number of records per page

      const { id, companyId, projectOwner } = req.query;

      const page = parseInt(req.query.page, 10) || 1; // page 1 default

      const offset = limit * (page - 1); // define offset

      // default db query
      const dbQuery = {
        where: {},
        limit,
        offset,
        order: [['id', 'DESC']],
      };

      // ability to search by id
      if (id !== undefined) {
        dbQuery.where = {
          ...dbQuery.where,
          id: parseInt(id, 10),
        };
      }

      // ability to search by companyId
      if (companyId !== undefined) {
        dbQuery.where = {
          ...dbQuery.where,
          company_id: parseInt(companyId, 10),
        };
      }

      // ability to search by projectOwner
      if (projectOwner !== undefined) {
        dbQuery.where = {
          ...dbQuery.where,
          project_owner: parseInt(projectOwner, 10),
        };
      }

      const projects = await this.model.findAndCountAll(dbQuery);

      const pages = Math.ceil(projects.count / limit);
      const formatted = projects.rows.map(formatFromDb);
      utils.success(res, { content: formatted, count: projects.count, pages, page });
    } catch (err) {
      utils.success(res, err);
    }
  };

  addProject = async (req, res) => {
    const formatted = formatForDb(req.body);

    try {
      const project = await this.model.create(formatted);
      utils.success(res, { content: formatFromDb(project) });
    } catch (err) {
      utils.fail(res, err);
    }
  };

  updateProject = async (req, res) => {
    const project = req.body;

    try {
      await this.model.update(formatForDb(project), {
        where: {
          id: project.id,
        },
      });
      const updated = await this.model.findOne({
        where: {
          id: req.body.id,
        },
      });
      utils.success(res, { project: formatFromDb(updated) });
    } catch (err) {
      utils.fail(res, { message: 'Unable to update this project.' });
    }
  };

  deleteProject = async (req, res) => {
    try {
      const result = await this.model.destroy({
        where: {
          id: req.body.id,
        },
      });
      if (result === 1) {
        utils.success(res, {
          message: 'Successfully deleted project.',
        });
      } else {
        utils.fail(res, { message: 'Unable to delete this project.' });
      }
    } catch (err) {
      utils.fail(res, err);
    }
  };
}
