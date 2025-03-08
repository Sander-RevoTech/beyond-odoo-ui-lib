import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { BydIconsModule } from '@beyond/icons';
import { BydTranslationModule } from '@beyond/translation';
import { BydDirectivePipeModule } from '@beyond/utils';

import { DualButtonComponent } from './dual-button.component';

type StoryType = DualButtonComponent;

export default {
  title: 'UI/Button/Dual',
  component: DualButtonComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [BydIconsModule, BydTranslationModule, BydDirectivePipeModule],
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
