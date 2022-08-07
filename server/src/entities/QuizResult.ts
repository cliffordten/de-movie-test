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
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Field(() => Number, { nullable: true })
  @Column()
  noCorrectAnswers!: number;

  @Field(() => Number, { nullable: true })
  @Column()
  totalAnsweredQuestions!: number;

  @Field(() => Number, { nullable: true })
  currentScore(): number {
    return this.noCorrectAnswers ? this.noCorrectAnswers * 10 : 0;
  }

  @Field(() => String)
  @Column()
  userId: string;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.quizResult)
  user: User;
}
