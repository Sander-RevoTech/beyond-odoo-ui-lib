import { Meta, StoryObj, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { TaIconType, LocalIconComponent, MaterialIconComponent } from '@beyond/icons';

import { ActionButtonComponent } from './action-button.component';

export default {
  title: 'UI/Button/Action',
  component: ActionButtonComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [MaterialIconComponent, LocalIconComponent],
    }),
    componentWrapperDecorator(story => `<div style="height: 50px; padding-top: 50px">${story}</div>`),
  ],

  render: args => ({ props: args }),
  args: {
    actions: [
      {
        callback: _ => console.log('test'),
        icon: TaIconType.Play,
      },
      {
        callback: _ => console.log('test'),
        icon: TaIconType.Stop,
      },
    ],
  },
} as Meta<ActionButtonComponent>;

export const Basic: StoryObj<ActionButtonComponent> = {};

export const MaterialIcons: StoryObj<ActionButtonComponent> = {
  args: {
    actions: [
      {
        callback: _ => console.log('test'),
        icon: 'play_circle_filled',
      },
      {
        callback: _ => console.log('test'),
        icon: 'pause_circle_filled',
      },
    ],
  },
};
