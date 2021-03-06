import { ICommandHandler, CommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteProjectCategoryCommand } from './delete-project-category.command';
import { ProjectCategoryCommandRepository } from '../../domain/project-category.command.repository';

@CommandHandler(DeleteProjectCategoryCommand)
export class DeleteProjectCategoryExecute implements ICommandHandler<DeleteProjectCategoryCommand> {

    constructor(
        @Inject('ProjectCategoryCommandRepository') private projectCategoryRepository: ProjectCategoryCommandRepository,
        private readonly publisher: EventPublisher) {
    }

    /**
     * @param {DeleteProjectCategoryCommand} command
     * @param {(value?) => void} resolve
     * @returns {Promise<void>}
     */
    async execute(command: DeleteProjectCategoryCommand, resolve: (value?) => void) {

        resolve();

        const projectCategory = await this.projectCategoryRepository.byId(command.id);

        projectCategory.remove();

        const projectCategoryRegister = this.publisher.mergeObjectContext(
            await this.projectCategoryRepository.store(projectCategory),
        );

        projectCategoryRegister.store(projectCategory);
        projectCategoryRegister.commit();
    }
}
