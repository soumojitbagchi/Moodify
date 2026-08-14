async function getSpotifyToken() {
    const endpoint = "https://accounts.spotify.com/api/token";

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch Spotify token");
    }

    const data = await response.json();
    req.access_token = data.access_token;
}

export { getSpotifyToken }
//todo : connect with frontend n then see which error we get and where i need to improve 