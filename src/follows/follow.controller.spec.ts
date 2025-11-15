import { Test, TestingModule } from "@nestjs/testing";
import { FollowsController } from "./follows.controller";
import { FollowsService } from "./follows.service";
import { AuthGuard } from "../auth/auth.guard";

describe('FollowsController', () => {
    let controller: FollowsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [FollowsController],
            providers: [FollowsService,
                {
                    provide: 'FollowRepository', useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(
                            string => ({ id: Date.now(), ...string })
                        ),
                        save: jest.fn(),
                        find: jest.fn(),
                        delete: jest.fn(),
                    }
                }],
        }).overrideGuard(AuthGuard).useValue({
            canActivate: jest.fn(() => true),
        }).compile();

        controller = module.get<FollowsController>(FollowsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('/:userId (POST) should follow a user', async () => {
        const userId = 1;
        const followedId = 2;
        const follow = controller.create(followedId.toString(), { user: { sub: userId } });

        expect(await follow).toHaveProperty('id');
        expect((await follow).user.id).toBe(userId);
        expect((await follow).followed.id).toBe(followedId);
    });

    it('/:userId (DELETE) should unfollow a user', async () => {
        const userId = 1;
        const followedId = 2;
        const followMock = { id: 1, user: { id: userId }, followed: { id: followedId } };
        jest.spyOn(controller['followsService']['followsRepository'], 'findOne').mockResolvedValueOnce(followMock as any);
        const unfollow = await controller.remove(followedId.toString(), { user: { sub: userId } });

        expect(unfollow).toHaveProperty('message', 'Unfollowed successfully');
    });
});