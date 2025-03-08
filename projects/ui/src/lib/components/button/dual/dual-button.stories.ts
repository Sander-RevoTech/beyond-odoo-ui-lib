import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { TaIconsModule } from '@beyond/icons';
import { TaTranslationModule } from '@beyond/translation';
import { TaDirectivePipeModule } from '@beyond/utils';

import { DualButtonComponent } from './dual-button.component';

type StoryType = DualButtonComponent;

export default {
  title: 'UI/Button/Dual',
  component: DualButtonComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [TaIconsModule, TaTranslationModule, TaDirectivePipeModule],
    }),
  ],
  render: args => {
    const { ...props } = args;
    return {
      props,
      template: `
        <byd-dual-button [first]="first" [second]="second"></byd-dual-button>
      `,
    };
  },
  args: {
    first: {
      icon: 'home',
      label: 'Home',
      callback: () => {
        alert('first');
      },
    },
    second: {
      icon: 'home',
      label: 'is Done',
      callback: () => {
        alert('second');
      },
    },
  },
} as Meta<StoryType>;

export const Basic: StoryObj<StoryType> = {};
