import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth/auth.guard';
import { BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PostsController', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: 'PostRepository',
          useValue: {
            findOne: jest.fn(({ where: { id } }) => {
              if (id === 1) {
                return { id: 1, body: 'Test post', user: { id: 1 } };
              }
              return null;
            }),
            create: jest.fn((string) => ({ id: Date.now(), ...string })),
            save: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        }
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('/post (POST) should create a post', async () => {
    const createPostDto = { body: 'Test post' };
    const userId = 1;
    const post = controller.create(createPostDto, { user: { sub: userId } });

    expect(await post).toHaveProperty('id');
    expect((await post).body).toBe('Test post');
    expect((await post).user.id).toBe(1);
  });

  it("/post (POST) shouldn't create a post with empty body", async () => {
    const createPostDto = { body: '' };
    const userId = 1;
    const post = controller.create(createPostDto, { user: { sub: userId } });

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('/post/:id (GET) should find a post by id', async () => {
    const post = controller.findOne('1');

    expect(await post).toHaveProperty('id', 1);
  });

  it("/post/:id (GET) should throw error if can't find post by id", async () => {
    const post = controller.findOne('-1');

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('/post (PATCH) should update a post', async () => {
    const createPostDto = { body: 'Test post upd' };
    const userId = 1;
    const post = controller.update('1', createPostDto, {
      user: { sub: userId },
    });

    expect(await post).toHaveProperty('body', 'Test post upd');
  });

  it('/post/:id (DELETE) should delete a post', async () => {
    const userId = 1;
    const post = controller.remove('1', { user: { sub: userId } });

    expect(await post).toHaveProperty(
      'message',
      'Post with id 1 has been removed',
    );
  });
});
