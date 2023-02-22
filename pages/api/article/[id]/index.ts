import { Article } from '../../../../service/Article/entity';
import { readyDB } from '../../../../service/database';
import { Role } from '../../../../service/type';
import { safeAPI } from '../../core';
import { verifyJWT } from '../../user/session/authing';

export default safeAPI(async (request, response) => {
  await readyDB;

  const ID = +request.query.id!;

  switch (request.method) {
    case 'GET': {
      const data = await Article.findByPk(ID);

      if (data) return response.json(data);

      response.status(404);
      return response.end();
    }
    case 'PATCH': {
      verifyJWT(request, [Role.Editor], {
        status: 403,
        statusText: 'Forbidden',
      });

      await Article.update(request.body, { where: { id: ID } });

      response.send(await Article.findByPk(ID));
    }
  }
});
