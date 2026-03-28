import { useEffect, useState } from "react";
import axios from "axios";
import "./RedditVideos.css";

const SUBREDDITS = ["DisasterUpdate", "worldnews", "NaturalDisasters"];
const REDDIT_BASE = "https://www.reddit.com/r";

export default function RedditVideos() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSub, setActiveSub] = useState("DisasterUpdate");
  const [filter, setFilter] = useState("all"); // all | video | image

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${REDDIT_BASE}/${activeSub}.json?limit=25`, {
        headers: { Accept: "application/json" },
      })
      .then((res) => {
        const children = res.data?.data?.children || [];
        const parsed = children
          .map((c) => {
            const d = c.data;
            const isVideo = d.is_video || d.post_hint === "hosted:video" || (d.url && d.url.includes("v.redd.it"));
            const isImage = d.post_hint === "image" || (d.url && /\.(jpg|jpeg|png|gif|webp)$/i.test(d.url));
            return {
              id: d.id,
              title: d.title,
              type: isVideo ? "video" : isImage ? "image" : "link",
              url: d.url,
              redditUrl: `https://reddit.com${d.permalink}`,
              thumbnail: d.thumbnail && d.thumbnail.startsWith("http") ? d.thumbnail : null,
              score: d.score,
              comments: d.num_comments,
              created: new Date(d.created_utc * 1000).toLocaleDateString(),
              author: d.author,
              flair: d.link_flair_text || "",
            };
          })
          .filter((p) => p.title);
        setPosts(parsed);
      })
      .catch(() => setError("Failed to load Reddit posts. Reddit may be blocking the request."))
      .finally(() => setLoading(false));
  }, [activeSub]);

  const filtered = filter === "all" ? posts : posts.filter((p) => p.type === filter);

  if (loading) return (
    <div className="loading" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "2rem", color: "#616161" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "3px solid #E0E0E0", borderTopColor: "#005EA2", animation: "spin 0.8s linear infinite" }}></div>
      Loading posts from r/{activeSub}...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="videos-section">
      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#1E3A5F" }}>
          <i className="fa-brands fa-reddit" style={{ color: "#FF4500", marginRight: "0.4rem" }}></i>
          Disaster Updates from Reddit
        </h2>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {SUBREDDITS.map((sub) => (
            <button key={sub} onClick={() => setActiveSub(sub)}
              style={{ padding: "0.3rem 0.75rem", fontSize: "0.8rem", borderRadius: 4, border: `1px solid ${activeSub === sub ? "#FF4500" : "#BDBDBD"}`, background: activeSub === sub ? "#FF4500" : "#fff", color: activeSub === sub ? "#fff" : "#424242", fontWeight: activeSub === sub ? 700 : 400, cursor: "pointer" }}>
              r/{sub}
            </button>
          ))}
        </div>
      </div>

      {/* Type filter */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem" }}>
        {[["all", "All Posts"], ["video", "Videos"], ["image", "Images"], ["link", "Links"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: "0.2rem 0.6rem", fontSize: "0.78rem", borderRadius: 3, border: `1px solid ${filter === val ? "#005EA2" : "#E0E0E0"}`, background: filter === val ? "#005EA2" : "#F5F7FA", color: filter === val ? "#fff" : "#616161", cursor: "pointer" }}>
            {label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: "#9E9E9E", alignSelf: "center" }}>{filtered.length} posts</span>
      </div>

      {error && (
        <div style={{ background: "#FFF3E0", border: "1px solid #FFE0B2", borderRadius: 4, padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.85rem", color: "#E65100" }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "0.4rem" }}></i>{error}
        </div>
      )}

      <div className="videos-grid">
        {filtered.map((post) => (
          <div key={post.id} className="video-card">
            {/* Thumbnail */}
            {post.thumbnail && (
              <div style={{ height: 140, overflow: "hidden", borderRadius: "4px 4px 0 0", background: "#1a2a3a", position: "relative" }}>
                <img src={post.thumbnail} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
                {post.type === "video" && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "rgba(0,0,0,0.6)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fa-solid fa-play" style={{ color: "#fff", fontSize: "0.9rem", marginLeft: 3 }}></i>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={{ padding: "0.75rem" }}>
              {post.flair && (
                <span style={{ background: "#F5F7FA", border: "1px solid #E0E0E0", borderRadius: 2, fontSize: "0.68rem", padding: "0.1rem 0.4rem", color: "#616161", marginBottom: "0.4rem", display: "inline-block" }}>
                  {post.flair}
                </span>
              )}
              <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#212121", marginBottom: "0.5rem", lineHeight: 1.4 }}>{post.title}</h3>
              <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "#9E9E9E", marginBottom: "0.6rem" }}>
                <span><i className="fa-solid fa-arrow-up" style={{ marginRight: 3 }}></i>{post.score?.toLocaleString()}</span>
                <span><i className="fa-solid fa-comment" style={{ marginRight: 3 }}></i>{post.comments}</span>
                <span>{post.created}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a href={post.redditUrl} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, textAlign: "center", padding: "0.3rem", fontSize: "0.78rem", background: "#FF4500", color: "#fff", borderRadius: 3, fontWeight: 600, textDecoration: "none" }}>
                  View on Reddit
                </a>
                {post.type === "video" && (
                  <a href={post.url} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, textAlign: "center", padding: "0.3rem", fontSize: "0.78rem", background: "#005EA2", color: "#fff", borderRadius: 3, fontWeight: 600, textDecoration: "none" }}>
                    Watch Video
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "3rem", color: "#9E9E9E" }}>
          <i className="fa-solid fa-inbox" style={{ fontSize: "2rem", marginBottom: "0.5rem", display: "block" }}></i>
          No {filter !== "all" ? filter : ""} posts found in r/{activeSub}
        </div>
      )}
    </div>
  );
}
