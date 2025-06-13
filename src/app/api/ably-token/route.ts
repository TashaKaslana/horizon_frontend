'use server';

import * as Ably from 'ably';
import {auth0} from "@/lib/auth0";

export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = session.user.sub;

    const client = new Ably.Rest({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
    });

    const tokenRequestData = await client.auth.createTokenRequest({
      clientId,
      capability: {
        '*': ['publish', 'subscribe', 'presence'],
      },
    });

    return Response.json(tokenRequestData);
  } catch (error) {
    console.error('Error creating Ably token:', error);
    return Response.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
