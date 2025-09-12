export function calculateWeight(post: any, maxValues: any, currentUserId: string) {
    const now = Date.now();
    const hoursDiff = (now - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);

    const timeScore = 1 / (hoursDiff + 1);

    const engagement = (post.like || 0) + (post.comments || 0);
    const engagementScore = engagement / (maxValues.engagement || 1);

    let relationScore = 0;
    if(post.author?._id?.toString() === currentUserId) relationScore = 1;
    else if (post.mention?.some((m: any) => m._id.toString() === currentUserId)) relationScore = 0.5;

    return 0.5 * timeScore + 0.3 + engagementScore + 0.2 * relationScore;
}

export function weightRandom(posts: any[], count: number) {
    const totalWeight = posts.reduce((sum, p) => sum + p.weight, 0);
    const selected: any[] = [];

    for(let i = 0; i < count; i++) {
        let r = Math.random() * totalWeight;
        for(const p of posts) {
            r -= p.weight;
            if(r <= 0) {
                selected.push(p);
                break;
            }
        }
    }
    return selected;
}