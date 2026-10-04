import type { ChallengeData } from '../types';
import { contractSource } from './contractSource';
import { assetUrl } from '../lib/assets';

const deployerAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

export const challengeData: ChallengeData = {
  contractAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  deployerAddress,
  transactionAddresses: {
    a1: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    a2: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    a3: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  },
  albums: {
    M1: {
      address: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
      cover: assetUrl('imgs/专辑/So I gave up music.jpg'),
      id: 1,
      name: 'So I gave up music.',
      artist: 'Yorushika',
      price: 50,
      initialOwner: deployerAddress,
      lyrics: '考えたってわからないし\n青空の下、君を待った\n風が吹いた正午、昼下がりを抜け出す想像',
    },
    M2: {
      address: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
      cover: assetUrl('imgs/专辑/Sunflower.jpg'),
      id: 2,
      name: 'Sunflower',
      artist: 'n-buna',
      price: 50,
      initialOwner: deployerAddress,
      lyrics: '私の命をあなたにあげたい\n夏の海原裸足のまま\nあなたを呼ぶ間に足が濡れる',
    },
    M3: {
      address: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
      cover: assetUrl('imgs/专辑/Flag.jpg'),
      id: 3,
      name: 'Flag',
      artist: 'gamla',
      price: 100,
      initialOwner: deployerAddress,
      lyrics: 'DLNUFCG{A_5unny_d3y_ju8t_f0r_y0u}',
    },
    M4: {
      address: '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
      cover: assetUrl('imgs/专辑/Chasing summer again.jpg'),
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
  playerAddress: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
  contractSource,
};
