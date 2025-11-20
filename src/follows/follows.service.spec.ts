import { Test, TestingModule } from '@nestjs/testing';
import { FollowsService } from './follows.service';

describe('FollowsService', () => {
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowsService,
        {
          provide: 'FollowRepository',
          useValue: {
            findOne: jest.fn(),
            create: jest.fn((string) => ({ id: Date.now(), ...string })),
            save: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should follow a user', async () => {
    const userId = 1;
    const followedId = 2;
    const follow = service.create(followedId, userId);

    expect(await follow).toHaveProperty('id');
    expect((await follow).user.id).toBe(userId);
    expect((await follow).followed.id).toBe(followedId);
  });

  it('should unfollow a user', async () => {
    const userId = 1;
    const followedId = 2;
    const followMock = {
      id: 1,
      user: { id: userId },
      followed: { id: followedId },
    };
    jest
      .spyOn(service['followsRepository'], 'findOne')
      .mockResolvedValueOnce(followMock as any);
    const unfollow = await service.remove(followedId, userId);

    expect(unfollow).toHaveProperty('message', 'Unfollowed successfully');
  });

  it('cannot unfollow unfollowed user', async () => {
    const userId = 1;
    const followedId = 2;
    const unfollow = service.remove(followedId, userId);
    expect(unfollow).rejects.toThrow('You are not following this user');
  });
});
