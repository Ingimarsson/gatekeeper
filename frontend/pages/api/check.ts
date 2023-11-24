import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req });

  if (!session) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  res.status(200).json({ message: "User authenticated" });
};
