import {Emitter} from '../utils/emitter';
import {createEmmitor} from '../utils/emitter';

export interface AnimationProcessor {
    startAnimation(animation: Animation): void;
    subscribeOnStartAnimation(callback: (a: Animation) => void): void;
    dispose(): void;
}

export function createAnimationProcessor(): AnimationProcessor {
  return new AnimationProcessorImpl();
}

class AnimationProcessorImpl implements AnimationProcessor {
    private startEmmiter: Emitter<Animation> = createEmmitor();

    public startAnimation(animation: Animation) {
      this.startEmmiter.notify(animation);
    }

    public subscribeOnStartAnimation(callback: (a: Animation) => void) {
      this.startEmmiter.subscribe(callback);
    }

    public dispose() {
      this.startEmmiter.dispose();
    }
}

export interface Animation {
    type: AnimationType;
}
export enum AnimationType {

}
