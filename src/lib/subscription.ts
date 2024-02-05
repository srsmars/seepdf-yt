import React from "react";
import { auth } from "@clerk/nextjs";
import { db } from "../db";
import { userSubscriptions } from "../db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

const Page = () => {
  const isSubscribed = async () => {
    const userId = await auth().currentUser?.id;
    const userSubscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .limit(1);

    const isValid =
      userSubscription[0] &&
      userSubscription[0].stripePriceId &&
      userSubscription[0].stripeCurrent;

    const PeriodEnd = userSubscription[0]?.expirationDate;

    return (
      !!isValid &&
      PeriodEnd?.getTime()! > Date.now() + DAY_IN_MS
    );
  };

  return (
    <div>
      {isSubscribed() && <p>Subscribed!</p>}
      {!isSubscribed() && <p>Not subscribed.</p>}
    </div>
  );
};

export default Page;