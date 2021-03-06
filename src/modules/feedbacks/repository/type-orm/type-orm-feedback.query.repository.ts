import { EntityRepository, getManager, SelectQueryBuilder } from 'typeorm';
import { ObjectType } from 'typeorm/common/ObjectType';
import { TypeOrmQueryRepository } from '../../../../common/database/type-orm/type-orm.query.repository';
import { FeedbackQueryRepository } from '../../domain/feedback-query.repository';
import { Feedback } from '../../domain/feedback';
import { FeedbackNotFoundException } from '../../domain/feedback-not-found.exception';

@EntityRepository()
export class TypeOrmFeedbackQueryRepository extends TypeOrmQueryRepository implements FeedbackQueryRepository {

    constructor() {
        super(getManager('query'));
    }

    /**
     * @returns {Promise<Feedback>}
     */
    public async getAll(): Promise<Feedback[]> {
        return this.createQueryBuilder().getMany();
    }

    /**
     * @param {number} id
     * @returns {Promise<Feedback>}
     */
    public getById(id: number): Promise<Feedback> {
        return this.createQueryBuilder()
            .andWhere('f.id = :id')
            .setParameter('id', id)
            .getOne()
            .then((feedback: Feedback) => {
                if (!feedback) throw FeedbackNotFoundException.fromId(id);
                return feedback;
            });
    }

    /**
     * @param {Feedback} feedback
     * @returns {Promise<Feedback>}
     */
    public async store(feedback: Feedback): Promise<Feedback> {
        return this.entityManager.save(feedback);
    }

    /**
     * @param {ObjectType<any>} entityClass
     * @param {string} alias
     *
     * @returns {SelectQueryBuilder<any>}
     */
    protected createQueryBuilder(entityClass: ObjectType<any> = Feedback, alias: string = 'f'): SelectQueryBuilder<any> {

        return this.entityManager.createQueryBuilder(entityClass, alias)
            .select(alias)
            .where(alias + '.deletedAt IS NULL');
    }
}