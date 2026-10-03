import type { ChallengeData } from '../types';
import { contractSource } from './contractSource';

const deployerAddress = '0x1000000000000000000000000000000000000002';

export const challengeData: ChallengeData = {
  contractAddress: '0x1000000000000000000000000000000000000001',
  deployerAddress,
  transactionAddresses: {
    a1: '0x2000000000000000000000000000000000000001',
    a2: '0x2000000000000000000000000000000000000002',
    a3: '0x2000000000000000000000000000000000000003',
  },
  albums: {
    M1: {
      address: '0x3000000000000000000000000000000000000001',
      id: 1,
      name: 'So I gave up music.',
      artist: 'Yorushika',
      price: 50,
      initialOwner: deployerAddress,
      lyrics: '考えたってわからないし\n青空の下、君を待った\n風が吹いた正午、昼下がりを抜け出す想像',
    },
    M2: {
      address: '0x3000000000000000000000000000000000000002',
      id: 2,
      name: 'Sunflower',
      artist: 'n-buna',
      price: 50,
      initialOwner: deployerAddress,
      lyrics: '私の命をあなたにあげたい\n夏の海原裸足のまま\nあなたを呼ぶ間に足が濡れる',
    },
    M3: {
      address: '0x3000000000000000000000000000000000000003',
      id: 3,
      name: 'Flag',
      artist: 'gamla',
      price: 100,
      initialOwner: deployerAddress,
      lyrics: 'DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}',
    },
    M4: {
      address: '0x4000000000000000000000000000000000000004',
      id: 'M4',
      name: 'Chasing summer again',
      artist: 'Unknown',
      price: 0,
      initialOwner: deployerAddress,
      lyrics: 'The last train follows the sunset.\nOne song brings the summer back.',
    },
  },
  tips: {
    tip1: '听说合约部署者很喜欢用专辑名作为 password。',
    tip2: '他最近好像花大价钱买了一个新专辑。',
  },
  benefitPassword: 'Chasing summer again',
  benefitAward: 50,
  benefitMaxBalance: 200,
  playerAddress: '0x9000000000000000000000000000000000000009',
  contractSource,
};
