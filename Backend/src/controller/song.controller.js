import { header } from "express-validator";

const refreshToken = async (req, res) => {

  const code = req.query.code || null;
  const state = req.query.state || null;
  const accessToken = req.access_token
  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': req.body,
        'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      json: true

    };
    res.status(200).json({ accessToken, success: true, header })
  }
}
export default { refreshToken }