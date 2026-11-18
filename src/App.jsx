import { useState } from "react";

const API_BASE = "https://api.github.com/users/";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const query = username.trim();

    // Clear previous result / error before anything else
    setUser(null);
    setError("");

    if (!query) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}${encodeURIComponent(query)}`);
      if (res.status === 404) {
        setError("User not found. Please try another username.");
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const blogUrl = (blog) => (/^https?:\/\//i.test(blog) ? blog : `https://${blog}`);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-4">
      <div className="card shadow-sm border-0 finder-card">
        <div className="card-body p-4">
          <div className="text-center mb-3">
            <h1 className="h3 title mb-1">GitHub User Finder</h1>
            <p className="text-muted small mb-0">Search a GitHub username to see profile details.</p>
          </div>

          <form className="d-flex gap-2" onSubmit={handleSearch}>
            <input
              type="text"
              name="username"
              className="form-control form-control-sm search-input"
              placeholder="e.g. torvalds, gaearon, octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-sm btn-search px-3">
              Search
            </button>
          </form>

          <div className="mt-3">
            {loading && <p className="text-center empty-text mb-0">Loading...</p>}

            {!loading && error && <div className="error-box text-center">{error}</div>}

            {!loading && !error && !user && (
              <p className="text-center empty-text mb-0">
                No user yet. Try searching for 'octocat'.
              </p>
            )}

            {!loading && user && (
              <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                <img src={user.avatar_url} alt={user.login} className="avatar" />
                <div>
                  <div className="d-flex align-items-baseline gap-2 flex-wrap">
                    <h2 className="h5 fw-bold mb-0">{user.name || user.login}</h2>
                    <span className="login">@{user.login}</span>
                  </div>

                  <div className="d-flex gap-2 my-2 flex-wrap">
                    <div className="stat"><strong>{user.public_repos}</strong><span>Repos</span></div>
                    <div className="stat"><strong>{user.followers}</strong><span>Followers</span></div>
                    <div className="stat"><strong>{user.following}</strong><span>Following</span></div>
                  </div>

                  <div className="d-flex gap-3 flex-wrap meta">
                    {user.location && <span>📍 {user.location}</span>}
                    {user.company && <span>🏢 {user.company}</span>}
                    {user.blog && (
                      <span>
                        🔗{" "}
                        <a href={blogUrl(user.blog)} target="_blank" rel="noreferrer">
                          {user.blog}
                        </a>
                      </span>
                    )}
                    <span>
                      🐙{" "}
                      <a href={user.html_url} target="_blank" rel="noreferrer">
                        View on GitHub
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
