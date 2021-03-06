import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { StoreProjectImageEvent } from './store-project-image.event';
import { ProjectImageQueryRepository } from '../../domain/project-image.query.repository';

@EventsHandler(StoreProjectImageEvent)
export class StoreProjectImageHandler implements IEventHandler<StoreProjectImageEvent> {

    constructor(
        @Inject('ProjectImageQueryRepository') private projectImageRepository: ProjectImageQueryRepository) {
    }

    /**
     * @param {StoreProjectImageEvent} event
     * @returns {Promise<void>}
     */
    async handle(event: StoreProjectImageEvent) {
        await this.projectImageRepository.store(event.projectImage);
    }
}
