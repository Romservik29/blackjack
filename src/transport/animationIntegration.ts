import {Scene} from '@babylonjs/core';
import {AnimationProcessor} from './animationProcessor';
import {Animation} from './animationProcessor';

export interface AnimationIntegrationProps {
    animationProcessor: AnimationProcessor;
    scene: Scene;
}

export class AnimationIntegration {
    subscriptions: Array<void> = [];
    constructor(props: AnimationIntegrationProps) {
      this.subscriptions.push(
          props.animationProcessor.subscribeOnStartAnimation(this.onStartAnimation),
      );
    }

    private onStartAnimation(animation: Animation) {
      switch (animation.type) {

      }
    }
}
