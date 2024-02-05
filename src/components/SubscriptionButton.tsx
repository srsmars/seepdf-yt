import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

type Props = {
  isPro: boolean;
};

const SubscriptionButton: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button disabled={loading} onClick={handleSubscription}>
      {props.isPro ? "Manage Subscriptions" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;