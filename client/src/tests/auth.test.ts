import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { logout, registerOrLogin, requestPasswordRecovery, resetPassword, isAuthenticated, loginWithGoogle } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { createPinia, setActivePinia } from 'pinia';

describe('auth service', () => {
 let mock: MockAdapter;

 beforeEach(() => {
  setActivePinia(createPinia());
  useAuthStore().logout();
  mock = new MockAdapter(axios);
 });

 it('should register a user', async () => {
  const mockResponse = { access_token: 'fake_token' };
  mock.onPost('http://localhost:8000/register').reply(200, mockResponse);

  await registerOrLogin('testuser', 'password', 'test@example.com', true);

  expect(mock.history.post[0].url).toBe('http://localhost:8000/register');
  expect(mock.history.post[0].data).toBe(
   JSON.stringify({
    username: 'testuser',
    password: 'password',
    email: 'test@example.com',
   }),
  );
  expect(useAuthStore().token).toBe('fake_token');
  expect(useAuthStore().username).toBe('testuser');
 });

 it('should throw an error', async () => {
  const mockResponse = { details: 'Error message' };
  mock.onPost('http://localhost:8000/register').reply(422, mockResponse);

  try {
   await registerOrLogin('testuser', 'password', 'test@example.com', true);
  } catch (error: any) {
   expect(error.response.data.details).toBe('Error message');
  }

  expect(mock.history.post[0].url).toBe('http://localhost:8000/register');
  expect(mock.history.post[0].data).toBe(
   JSON.stringify({
    username: 'testuser',
    password: 'password',
    email: 'test@example.com',
   }),
  );
 });

 it('should login a user', async () => {
  const mockResponse = { access_token: 'fake_token' };
  mock.onPost('http://localhost:8000/token').reply(200, mockResponse);

  await registerOrLogin('testuser', 'password', undefined, false);

  expect(mock.history.post[0].url).toBe('http://localhost:8000/token');
  expect(mock.history.post[0].data).toBe(
   JSON.stringify({
    username: 'testuser',
    password: 'password',
   }),
  );
  expect(useAuthStore().token).toBe('fake_token');
  expect(useAuthStore().username).toBe('testuser');
 });

 it('should logout a user', () => {
  useAuthStore().setUserData('fake_token', 'testuser');
  logout();
  expect(useAuthStore().token).toBeNull();
  expect(useAuthStore().username).toBeNull();
 });

 it('should request password recovery', async () => {
  mock.onPost('http://localhost:8000/password-recovery').reply(200);

  await requestPasswordRecovery('test@example.com');

  expect(mock.history.post[0].url).toBe('http://localhost:8000/password-recovery');
  expect(mock.history.post[0].data).toBe(
   JSON.stringify({
    email: 'test@example.com',
   }),
  );
 });

 it('should reset password', async () => {
  mock.onPost('http://localhost:8000/password-reset').reply(200);

  await resetPassword('new_password', 'reset_token');

  expect(mock.history.post[0].url).toBe('http://localhost:8000/password-reset');
  expect(mock.history.post[0].data).toBe(
   JSON.stringify({
    new_password: 'new_password',
    token: 'reset_token',
   }),
  );
 });
});
