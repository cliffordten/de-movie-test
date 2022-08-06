import { ObjectType, Field } from "type-graphql";
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class QuizResult extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => Number)
  @Column()
  noCorrectAnswers!: number;

  @Field(() => Number)
  currentScore(): number {
    return this.noCorrectAnswers ? this.noCorrectAnswers * 10 : 0;
  }

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.quizResult)
  user: User;
}
