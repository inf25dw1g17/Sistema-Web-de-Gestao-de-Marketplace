import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Author, Book} from '../models';
import {BookRepository} from './book.repository';

export class AuthorRepository extends DefaultCrudRepository<
  Author,
  typeof Author.prototype.id
> {
  public readonly books: HasManyRepositoryFactory<
    Book,
    typeof Author.prototype.id
  >;

  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('BookRepository')
    protected bookRepositoryGetter: Getter<BookRepository>,
  ) {
    super(Author, dataSource);

    this.books = this.createHasManyRepositoryFactoryFor(
      'books',
      bookRepositoryGetter,
    );
    this.registerInclusionResolver(
      'books',
      this.books.inclusionResolver,
    );
  }
}
