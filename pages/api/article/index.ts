import { Article } from '../../../service/Article/entity';
import { readyDB } from '../../../service/database';
import { Role } from '../../../service/type';
import { safeAPI } from '../core';
import { verifyJWT } from '../user/session/authing';

export default safeAPI(async (request, response) => {
  switch (request.method) {
    case 'GET': {
      const { pageIndex = 1, pageSize = 10, ...filter } = request.query;

      await readyDB;

      const data = await Article.findAndCountAll({
        where: filter,
        offset: (+pageIndex! - 1) * +pageSize!,
        limit: +pageSize!,
      });
      return response.json(data);
    }
    case 'POST': {
      verifyJWT(request, [Role.Editor], {
        status: 403,
        statusText: 'Forbidden',
      });

      const article = Article.build(request.body);

      response.send(await article.save());
    }
  }
});
