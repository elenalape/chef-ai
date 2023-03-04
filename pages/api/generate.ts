import type { NextApiRequest, NextApiResponse } from "next";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredients, cookTime } = req.body as {
    ingredients: string[];
    cookTime: number;
  };

  const prompt = `I have these ingredients: ${ingredients.join(
    ", "
  )}. Suggest 3 different recipes I can cook in under ${cookTime} minutes. The response should be 3 paragraphs. Don't include ingredient lists etc. in the response, and no decorative text like "Here's a recipe for you" or "Another recipe you'd enjoy...".`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ content: prompt, role: "user" }],
    }),
  });

  const data = await response.json();

  const recipes = data.choices[0].message.content
    .split("\n")
    .filter((line: string | any[]) => line.length > 0);

  res.status(200).json({
    recipes: [recipes[0], recipes[1], recipes[2]],
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      await post(req, res);
      break;
    default:
      res.status(405).end();
  }
};

export default handler;
