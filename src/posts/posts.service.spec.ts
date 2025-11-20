import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { BadRequestException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const createPostDto = { body: 'Test post' };
    const userId = 1;
    const post = service.create(createPostDto, userId);

    expect(await post).toHaveProperty('id');
    expect((await post).body).toBe('Test post');
    expect((await post).user.id).toBe(1);
  });

  it("shouldn't create a post with empty body", async () => {
    const createPostDto = { body: '' };
    const userId = 1;
    const post = service.create(createPostDto, userId);

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('should create a reply post', async () => {
    const createPostDto = { body: 'Test post', replyToPostId: 1 };
    const userId = 1;
    const post = service.create(createPostDto, userId);

    expect(await post).toHaveProperty('id');
    expect((await post).replyToPost?.id).toBe(1);
  });

  it('should throw error when replying to non-existing post', async () => {
    const createPostDto = { body: 'Test post', replyToPostId: -1 };
    const userId = 1;
    const post = service.create(createPostDto, userId);

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('should find a post by id', async () => {
    const post = service.findOne(1);

    expect(await post).toHaveProperty('id', 1);
  });

  it("should throw error if can't find post by id", async () => {
    const post = service.findOne(-1);

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('should update a post', async () => {
    const updatePostDto = { body: 'Test post upd' };
    const post = service.update(1, 1, updatePostDto);

    expect(await post).toHaveProperty('body', 'Test post upd');
  });

  it("should throw error if can't find updated post by id", async () => {
    const updatePostDto = { body: 'Test post upd' };
    const post = service.update(-1, 1, updatePostDto);

    expect(post).rejects.toThrow(BadRequestException);
  });

  it('should remove a post', async () => {
    const post = service.remove(1, 1);

    expect(await post).toHaveProperty(
      'message',
      'Post with id 1 has been removed',
    );
  });
});
