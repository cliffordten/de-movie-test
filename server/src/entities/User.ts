import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { QuizResult } from "./QuizResult";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => String)
  @Column()
  username!: string;

  @Field(() => String)
  @Column()
  email!: string;

  @Field(() => String, { nullable: true })
  accessToken: string;

  @Column()
  password!: string;

  @Field(() => Number, { nullable: true })
  highestScore: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [QuizResult])
  @OneToMany(() => QuizResult, (quizResult) => quizResult.user)
  quizResult: QuizResult[];
}
