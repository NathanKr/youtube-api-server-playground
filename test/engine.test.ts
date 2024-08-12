import { describe, it, expect, vi, beforeEach } from "vitest";
import { google } from "googleapis";
import { uploadVideo } from "../src/engine"; // Adjust the import path as needed
import { UploadVideoArgs } from "../src/types";

// Define the type for the mock object
type YoutubeMock = {
  videos: {
    insert: ReturnType<typeof vi.fn>;
  };
  thumbnails: {
    set: ReturnType<typeof vi.fn>;
  };
  playlistItems: {
    insert: ReturnType<typeof vi.fn>;
  };
};

// Create a mock ReadStream
const mockReadStream = {
  on: vi.fn(),
  pipe: vi.fn(),
  // Add other methods if needed
};

// Mock the googleapis module
vi.mock("googleapis", () => {
  const youtubeMock: YoutubeMock = {
    videos: {
      insert: vi.fn().mockResolvedValue({ data: { id: "mockVideoId" } }),
    },
    thumbnails: {
      set: vi.fn().mockResolvedValue({}),
    },
    playlistItems: {
      insert: vi.fn().mockResolvedValue({
        data: { snippet: { title: "Mock Playlist Item" } },
      }),
    },
  };

  return {
    google: {
      auth: {
        OAuth2: vi.fn(() => ({
          setCredentials: vi.fn(),
        })),
      },
      youtube: vi.fn(() => youtubeMock), // Mock the function returning the mock object
    },
  };
});

// Mock the fs module
vi.mock("fs", () => ({
  default: { createReadStream: vi.fn(() => mockReadStream) },
}));

describe("uploadVideo", () => {
  const mockArgs: UploadVideoArgs = {
    accessToken: "mockAccessToken",
    videoSnippet: { title: "Test Video", description: "Test Description" },
    videoStatus: {
      privacyStatus: "private",
      selfDeclaredMadeForKids: false,
    },
    videoPath: "path/to/video.mp4",
    thumbnail: { path: "path/to/thumbnail.jpg" },
    playlistItem: { playlistId: "mockPlaylistId" },
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it("should upload a video and set a thumbnail and playlist item", async () => {
    await uploadVideo(mockArgs);

    // Get the youtubeMock object from google.youtube
    const youtubeMock = google.youtube({ version: "v3" });

    // Ensure google.youtube is called with the correct parameters
    expect(google.youtube).toHaveBeenCalled();
    expect(google.youtube).toHaveBeenCalledWith({ version: "v3" });

    // Ensure videos.insert is called with the correct parameters
    expect(youtubeMock.videos.insert).toHaveBeenCalledWith({
      part: ["snippet", "status"],
      requestBody: {
        snippet: mockArgs.videoSnippet,
        status: mockArgs.videoStatus,
      },
      media: {
        body: mockReadStream, // Mocked stream object
      },
    });

    // Ensure thumbnails.set is called with the correct parameters
    expect(youtubeMock.thumbnails.set).toHaveBeenCalledWith({
      videoId: "mockVideoId",
      media: {
        body: mockReadStream, // Mocked stream object
      },
    });

    // Ensure playlistItems.insert is called with the correct parameters if playlistItem is provided
    if (mockArgs.playlistItem) {
      expect(youtubeMock.playlistItems.insert).toHaveBeenCalledWith({
        part: ["snippet"],
        requestBody: {
          snippet: {
            playlistId: mockArgs.playlistItem.playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: "mockVideoId",
            },
          },
        },
      });
    }
  });
});
