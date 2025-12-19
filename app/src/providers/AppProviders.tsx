import React from 'react';
import { UserProvider } from '../contexts/UserContext';
import { MessagesProvider } from '../contexts/MessagesContext';
import { ChatProvider } from '../contexts/ChatContext';
import { AudioProvider } from '../contexts/AudioContext';
import { AuthProvider } from '../contexts/AuthContext';
import { MediaModalProvider } from '../contexts/MediaModalContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

const composeProviders = (
  ...providers: Array<
    React.JSXElementConstructor<{ children: React.ReactNode }>
  >
) => {
  return ({ children }: { children: React.ReactNode }) =>
    providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, children);
};

const AppProvidersComponent = composeProviders(
  MediaModalProvider,
  AuthProvider,
  UserProvider,
  ChatProvider,
  MessagesProvider,
  AudioProvider
);

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return <AppProvidersComponent>{children}</AppProvidersComponent>;
};
