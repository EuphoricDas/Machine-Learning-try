import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  QnAConfiguration,
  QnaItem,
  QnAResponse
} from '../../models/qna-configuration';
import { ActivitiesService } from '../../services/activities.service';
import { SpeechService } from '../../services/speech.service';
import { Utils } from '../../shared/utils';
import { ActivityComponent } from '../activity.component';

@Component({
  selector: 'videoflo-qna-activity',
  templateUrl: './qna-activity.component.html',
  styles: [],
})
export class QnaActivityComponent
  extends ActivityComponent
  implements OnInit, OnDestroy {
  config: QnAConfiguration = {
    title: '',
    description: '',
    noOfQuestionsToAsk: -1,
    qnaPairs: [],
  };

  private questionsToAsk: QnaItem[];

  questions: QnaItem[] = [];

  allQuestionsCompleted = false;

  private curQuestion: QnaItem;

  constructor(activitiesService: ActivitiesService) {
    super(activitiesService);
  }

  async ngOnInit(): Promise<void> {
    super.OnInit();

    Object.assign(this.config, this.activity.configuration);

    // Set isAnswered and isAnsweredCorrectly properties to false, just in case
    this.config.qnaPairs.forEach((qnaPair) => {
      qnaPair.isAnswered = false;
      qnaPair.isAnswerCorrect = false;
    });

    if (this.shouldDisplayResults) {
      if (
        !this.config.noOfQuestionsToAsk ||
        this.config.noOfQuestionsToAsk > this.config.qnaPairs.length
      ) {
        this.config.noOfQuestionsToAsk = this.config.qnaPairs.length;
      }

      this.questionsToAsk = Utils.shuffleArray(this.config.qnaPairs).slice(
        0,
        this.config.qnaPairs.length - 1
      );

      await this.askNextQuestion();
    }
  }

  private async askNextQuestion() {
    if (this.questionsToAsk.length > 0) {
      this.curQuestion = this.questionsToAsk.shift();
      this.curQuestion.isAnswered = false;
      this.questions.push(this.curQuestion);
    } else {
      const participant = await this.activitiesService.getParticipant(
        null,
        null,
        this.activity.gatherFrom[0]
      );

      this.activitiesService.submitActivityDataGathered(this.activity.id, {
        gatheredFrom: participant.participantId,
        payload: this.questions.map(
          (item) =>
          ({
            question: item.question,
            expectedAnswer: item.expectedAnswer,
            actualAnswer: item.actualAnswer,
            isAnswered: item.isAnswered,
            isAnswerCorrect: item.isAnswerCorrect,
            attemptsMade: item.attemptsMade,
          } as QnAResponse)
        ),
      });

      this.allQuestionsCompleted = true;
    }
  }

  async onAnswered(isAnswerCorrect: boolean) {
    this.curQuestion.isAnswered = true;
    this.curQuestion.isAnswerCorrect = isAnswerCorrect;
    await this.askNextQuestion();
  }

  onNextClicked() {
    this.onActivityActionForAllParticipants(true);
  }

  onRejectClicked() {
    this.onActivityActionForAllParticipants(false);
  }

  onActivityStateChanged(_state: any): void {
    // Nothing to be done here...
  }

  onActivityDataPublished(): void {
    // Nothing to be done here...
  }

  ngOnDestroy() {
    super.OnDestroy();
  }
}
