import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Author, Book} from '../models';
import {AuthorRepository} from './author.repository';

export class BookRepository extends DefaultCrudRepository<
  Book,
  typeof Book.prototype.id
> {
  public readonly author: BelongsToAccessor<
    Author,
    typeof Book.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('AuthorRepository')
    protected authorRepositoryGetter: Getter<AuthorRepository>,
  ) {
    super(Book, dataSource);

    this.author = this.createBelongsToAccessorFor(
      'author',
      authorRepositoryGetter,
    );
    this.registerInclusionResolver(
      'author',
      this.author.inclusionResolver,
    );
  }
}
