"use client";

import { BuiltInProviderType } from "next-auth/providers/index";
import {
  LiteralUnion,
  signIn,
  SignInAuthorizationParams,
  SignInOptions,
  signOut,
  SignOutParams,
} from "next-auth/react";
import { ReactNode } from "react";

export function SignInButton({
  children,
  provider,
  options,
  authorizationParams,
}: {
  children?: ReactNode;
  provider?: LiteralUnion<BuiltInProviderType>;
  options?: SignInOptions;
  authorizationParams?: SignInAuthorizationParams;
}) {
  return (
    <button onClick={() => signIn(provider, options, authorizationParams)}>
      {children}
    </button>
  );
}

export function SignOutButton({
  children,
  options,
}: {
  children?: ReactNode;
  options?: SignOutParams<true>;
}) {
  return <button onClick={() => signOut(options)}>{children}</button>;
}
