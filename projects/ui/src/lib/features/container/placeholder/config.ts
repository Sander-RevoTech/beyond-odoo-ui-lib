export type Placeholder = {
  type: 'container' | 'row' | 'col' | 'item' | 'picture' | 'avatar';
  children?: Placeholder[];
  gridSize?: number;
  attributes?: ('big' | 'empty' | 'block' | 'no-shadow')[];
  repeat: number;
};

export const cardPlaceholder: Placeholder = {
  type: 'item',
  children: [
    {
      type: 'col',
      children: [
        {
          type: 'row',
          children: [
            {
              type: 'col',
              gridSize: 8,
              attributes: ['big'],
              repeat: 1,
            },
            {
              type: 'col',
              gridSize: 4,
              attributes: ['empty', 'big'],
              repeat: 1,
            },
            {
              type: 'col',
              gridSize: 4,
              repeat: 1,
            },
          ],
          repeat: 1,
        },
      ],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 2,
      children: [
        {
          type: 'avatar',
          repeat: 1,
        },
      ],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 12,
      children: [
        {
          type: 'row',
          children: [
            {
              type: 'col',
              gridSize: 8,
              repeat: 1,
            },
            {
              type: 'col',
              gridSize: 4,
              attributes: ['empty'],
              repeat: 1,
            },
          ],
          repeat: 2,
        },
      ],
      repeat: 1,
    },
    {
      type: 'row',
      children: [
        {
          type: 'col',
          gridSize: 12,
          repeat: 6,
        },
      ],
      repeat: 1,
    },
  ],
  repeat: 1,
};

export const menuPlaceholder: Placeholder = {
  type: 'row',
  children: [
    {
      type: 'col',
      gridSize: 3,
      attributes: ['big'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 1,
      attributes: ['big', 'empty'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 4,
      attributes: ['big'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 1,
      attributes: ['big', 'empty'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 3,
      attributes: ['big'],
      repeat: 1,
    },
  ],
  repeat: 3,
};

export const morePlaceholder: Placeholder = {
  type: 'row',
  children: [
    {
      type: 'col',
      gridSize: 4,
      attributes: ['big', 'empty'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 4,
      attributes: ['big'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 4,
      attributes: ['big', 'empty'],
      repeat: 1,
    },
    {
      type: 'col',
      gridSize: 12,
      attributes: ['empty'],
      repeat: 1,
    },
  ],
  repeat: 3,
};

export const fileListPlaceholder: Placeholder = {
  type: 'container',
  attributes: ['block'],
  children: [
    {
      type: 'item',
      attributes: ['no-shadow'],
      gridSize: 3,
      repeat: 1,
      children: [
        {
          type: 'col',
          gridSize: 4,
          repeat: 9,
          children: [
            {
              type: 'picture',
              repeat: 1,
            },
          ],
        },
      ],
    },
  ],
  repeat: 1,
};
export const cardListPlaceholder: Placeholder = {
  type: 'container',
  children: [
    {
      type: 'container',
      children: [cardPlaceholder],
      repeat: 3,
    },
    {
      type: 'container',
      children: [morePlaceholder],
      repeat: 3,
    },
  ],
  repeat: 1,
};

export const detailPlaceholder: Placeholder = {
  type: 'container',
  children: [
    {
      type: 'container',
      children: [cardPlaceholder],
      repeat: 2,
    },
  ],
  repeat: 1,
};
export type PlaceholderConfig = 'default' | 'cardList' | 'detail' | 'fileList';

export const getPlaceholderConfig = (placeHolder: PlaceholderConfig): Placeholder => {
  switch (placeHolder) {
    case 'cardList':
      return cardListPlaceholder;
    case 'detail':
      return detailPlaceholder;
    case 'fileList':
      return fileListPlaceholder;
    default:
      return cardPlaceholder;
  }
};
