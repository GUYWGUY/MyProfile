
/**
 * Simple service to handle image paths.
 * Since local images are provided, we just return the fallback logic or the ID-based path.
 */
export const generateAIImage = async (prompt: string, id: string): Promise<string> => {
  // We prioritize the local image files provided by the user.
  // The ProjectCard already tries to load paper.imageUrl first.
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(id)}&background=1e293b&color=fff&size=512`;
};
