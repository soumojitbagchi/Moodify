import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { once } from 'node:events';
import { spawn } from 'node:child_process';

process.env.NODE_ENV = 'test';
process.env.SPOTIFY_CLIENT_ID = '';
process.env.SPOTIFY_CLIENT_SECRET = '';

const { default: app } = await import('./src/app.js');
let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function post(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie') };
}

test('health responds without a database or external credentials', async () => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
});

test('mood catalog declares demo data and exposes five unique moods', async () => {
  const response = await fetch(`${baseUrl}/api/moods`);
  const data = await response.json();
  assert.equal(response.status, 200);
  assert.equal(data.source, 'demo');
  assert.equal(data.moods.length, 5);
  assert.equal(new Set(data.moods.map((mood) => mood.id)).size, 5);
  for (const mood of data.moods) {
    assert.ok(mood.label && mood.description && mood.title);
    const songsResponse = await fetch(`${baseUrl}/api/moods/${mood.id}/songs`);
    const selection = await songsResponse.json();
    assert.equal(songsResponse.status, 200);
    assert.equal(selection.source, 'demo');
    assert.equal(selection.mood, mood.id);
    assert.equal(selection.songs.length, 3);
    assert.ok(selection.songs.every((song) => song.mood === mood.id && song.id && song.title && song.artist && /^\d+:\d{2}$/.test(song.duration)));
  }
});

test('unsupported and prototype-key moods are rejected', async () => {
  for (const mood of ['unknown', '__proto__', 'constructor', 'toString']) {
    const response = await fetch(`${baseUrl}/api/moods/${mood}/songs`);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).success, false);
  }
});

test('unknown routes and raw Spotify token endpoint are not exposed', async () => {
  for (const path of ['/api/unknown', '/api/songs/token']) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 404);
    assert.equal((await response.json()).success, false);
  }
});

test('unconfigured Spotify returns a helpful service-unavailable response', async () => {
  const response = await fetch(`${baseUrl}/api/songs/search?q=calm`);
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.match(data.message, /not configured/);
  assert.equal(data.stack, undefined);
});

test('invalid registration is rejected before database access', async () => {
  const { status, data } = await post('/api/auth/register', {});
  assert.equal(status, 400);
  assert.equal(data.success, false);
  assert.ok(data.errors.length);
});

test('registration rejects object identifiers and passwords', async () => {
  const credentials = { name: 'Demo Listener', username: 'listener', email: 'listener@example.com', password: 'password123' };
  for (const field of ['name', 'username', 'email', 'password']) {
    const result = await post('/api/auth/register', { ...credentials, [field]: { $ne: null } });
    assert.equal(result.status, 400);
    assert.ok(result.data.errors.some((error) => error.field === field));
  }
});

test('registration enforces minimum password length and bcrypt byte limit', async () => {
  const credentials = { name: 'Demo Listener', username: 'listener', email: 'listener@example.com' };
  for (const password of ['short', 'a'.repeat(73), 'é'.repeat(37)]) {
    const result = await post('/api/auth/register', { ...credentials, password });
    assert.equal(result.status, 400);
    assert.ok(result.data.errors.some((error) => error.field === 'password'));
  }
});

test('valid registration clearly reports unavailable demo accounts', async () => {
  const { status, data } = await post('/api/auth/register', { name: 'Demo Listener', username: 'listener', email: 'listener@example.com', password: 'password123' });
  assert.equal(status, 503);
  assert.match(data.message, /Configure MongoDB/);
});

test('login requires a string identifier and password', async () => {
  for (const credentials of [{}, { password: 'password123' }, { username: { $ne: null }, password: 'password123' }, { username: 'listener', password: { $ne: null } }]) {
    assert.equal((await post('/api/auth/login', credentials)).status, 400);
  }
});

test('valid login clearly reports unavailable demo accounts', async () => {
  assert.equal((await post('/api/auth/login', { username: 'listener', password: 'password123' })).status, 503);
});

test('anonymous session lookup is unauthorized', async () => {
  const response = await fetch(`${baseUrl}/api/auth/me`);
  assert.equal(response.status, 401);
  assert.equal((await response.json()).success, false);
});

test('logout clears the HTTP-only session cookie without needing MongoDB', async () => {
  const result = await post('/api/auth/logout', {});
  assert.equal(result.status, 200);
  assert.match(result.cookie, /token=;/);
  assert.match(result.cookie, /HttpOnly/);
});

test('malformed JSON returns a safe error without echoing the body', async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"password":"private-value"' });
  assert.equal(response.status, 400);
  const data = await response.json();
  assert.equal(data.message, 'Invalid JSON body.');
  assert.equal(data.stack, undefined);
  assert.ok(!JSON.stringify(data).includes('private-value'));
});

test('oversized request bodies are rejected', async () => {
  const result = await post('/api/auth/login', { username: 'listener', password: 'a'.repeat(17000) });
  assert.equal(result.status, 413);
});

test('startup fails explicitly when another app owns the requested port', async () => {
  const child = spawn(process.execPath, [new URL('./server.js', import.meta.url).pathname], {
    env: { ...process.env, MONGO_URI: '', JWT_SECRET: '', PORT: String(server.address().port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (data) => { output += data; });
  child.stderr.on('data', (data) => { output += data; });
  const [exitCode] = await once(child, 'close');
  assert.equal(exitCode, 1);
  assert.match(output, /Unable to start/);
  assert.ok(!output.includes('Server is running'));
});
