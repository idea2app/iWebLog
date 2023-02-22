import { Comment } from '../../../../service/Comment/entity';
import { readyDB } from '../../../../service/database';
import { Role } from '../../../../service/type';
import { safeAPI } from '../../core';
import { verifyJWT } from '../../user/session/authing';

export default safeAPI(async (request, response) => {
  switch (request.method) {
    case 'GET': {
      const { id, pageIndex = 1, pageSize = 10 } = request.query;

      await readyDB;

      const data = await Comment.findAndCountAll({
        include: [Comment.Poster],
        where: { articleId: id },
        offset: (+pageIndex! - 1) * +pageSize!,
        limit: +pageSize!,
      });
      return response.json(data);
    }
    case 'POST': {
      const { id } = verifyJWT(request, [Role.Reader, Role.Editor], {
        status: 403,
        statusText: 'Forbidden',
      });

      const comment = Comment.build(
        {
          ...request.body,
          posterId: id,
          articleId: +request.query.id!,
        },
        { include: [Comment.Poster] },
      );
      await comment.save();

      response.send(await comment.reload());
    }
  }
});
