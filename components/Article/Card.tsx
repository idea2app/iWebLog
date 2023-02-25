import { text2color, TimeDistance } from 'idea-react';
import { observer } from 'mobx-react';
import type { FC } from 'react';
import { Badge, Card, Col, Row } from 'react-bootstrap';

import { ArticleData } from '../../service/Article/entity';
import { TimeOption } from '../data';

export interface ArticleCardProps extends ArticleData {
  className?: string;
}

export const ArticleCard: FC<ArticleCardProps> = observer(
  ({
    className = '',
    id,
    title,
    author,
    tags,
    image,
    createdAt,
  }: ArticleCardProps) => (
    <Card className={`shadow-sm ${className}`}>
      <div className="position-relative w-100" style={{ paddingBottom: '56%' }}>
        <div className="position-absolute top-0 left-0 w-100 h-100">
          <Card.Img
            className="h-100 object-fit-cover"
            style={{ objectPosition: 'top left' }}
            src={image}
          />
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title as="h3" className="h5 flex-fill">
          <a
            className="text-decoration-none text-secondary text-truncation-lines"
            href={`/article/${id}`}
          >
            {title}
          </a>
        </Card.Title>

        <Row className="mt-2 flex-fill">
          <Col
            as="a"
            className="text-decoration-none text-end text-truncate align-self-end"
            href={`/search?keywords=${author}`}
          >
            {author}
          </Col>
        </Row>
        <Row as="footer" className="flex-fill small mt-1">
          <Col xs={8}>
            {tags.split(/\s+/).map(tag => (
              <Badge
                as="a"
                key={tag}
                className="text-decoration-none me-2"
                bg={text2color(tag, ['light'])}
                href={`/search?tag=${tag}`}
              >
                {tag}
              </Badge>
            ))}
          </Col>
          <Col className="text-end" xs={4}>
            <TimeDistance {...TimeOption()} date={createdAt} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  ),
);
