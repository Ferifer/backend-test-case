import { DataSource } from 'typeorm';
import { MembersEntity } from './entities/member.entity';


export const memberProviders = [
    {
        provide: 'MEMBERS_REPOSITORY',
        useFactory: (dataSource: DataSource) =>
            dataSource.getRepository(MembersEntity),
        inject: ['DATA_SOURCE'],
    }
];