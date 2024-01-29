import { BoolNodeConfig, DefaultNodeConfig } from 'services/config/config';

export const jsonDummyTree: Array<BoolNodeConfig | DefaultNodeConfig> = [
  {
    id: '0',
    type: 'BoolNode',
    data: {
      label: 'Do you like cats?',
      yesId: '1',
      noId: '2',
    },
  },
  {
    id: '1',
    type: 'default',
    data: {
      label: 'You like cats',
      children: [],
    },
  },
  {
    id: '2',
    type: 'default',
    data: {
      label: "You don't like cats",
      children: ['3', '4', '5'],
    },
  },
  {
    id: '3',
    type: 'default',
    data: {
      label: 'I like dogs',
      children: [],
    },
  },
  {
    id: '4',
    type: 'default',
    data: {
      label: 'I like Birds',
      children: [],
    },
  },
  {
    id: '5',
    type: 'default',
    data: {
      label: 'I like lizards',
      children: [],
    },
  },
];