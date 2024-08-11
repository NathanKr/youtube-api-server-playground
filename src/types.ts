export interface Credentials {
    web: {
      client_id: string;
      project_id: string;
      auth_uri: string;
      token_uri: string;
      auth_provider_x509_cert_url: string;
      client_secret: string;
      redirect_uris: string[];
      javascript_origins: string[];
    };
  }

  export interface VideoSnippet {
    title: string;
    description?: string;
    tags?: string[];
    publishedAt?: Date;
    defaultAudioLanguage?: string;
    defaultLanguage?: string;
    // Add other snippet properties as needed
  }
  
  export interface VideoStatus {
    privacyStatus: 'private' | 'public' | 'unlisted';
    madeForKids: boolean;
    // Add other status properties as needed
  }
  
  export interface Thumbnail {
    path: string;
    // Add other thumbnail properties if necessary
  }
  
  export interface PlaylistItem {
    playlistId: string;
    // Add other playlist item properties if necessary
  }
  
  export interface UploadVideoArgs {
    accessToken: string;
    videoPath: string;
    videoSnippet: VideoSnippet;
    videoStatus: VideoStatus;
    thumbnail?: Thumbnail;
    playlistItem?: PlaylistItem;
  }