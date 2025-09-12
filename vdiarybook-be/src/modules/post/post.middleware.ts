import { IPost } from "./post.model";

export function handlePostType(post: IPost) {
  const hasImages = Array.isArray(post.images) && post.images.length > 0;
  const hasVideos = Array.isArray(post.videos) && post.videos.length > 0;
  const hasLinks = Array.isArray(post.links) && post.links.length > 0;

  if (post.originalPost) {
    post.type = "share";
  } else if (hasImages && !hasVideos && !hasLinks) {
    post.type = "image";
  } else if (!hasImages && hasVideos && !hasLinks) {
    post.type = "video";
  } else if (!hasImages && !hasVideos && hasLinks) {
    post.type = "link";
  } else if (!hasImages && !hasVideos && !hasLinks) {
    post.type = "text";
  } else {
    post.type = "mixed";
  }
}
