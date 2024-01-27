import { getCookie, setCookie } from "typescript-cookie";

const API_ROOT = "https://ant-logic-api.thebenjicat.dev";
type Result = "success" | "fail";

interface User {
  username: string;
  scores: number[];
  owned_vals: number[];
  currency: number;
}

async function get_self_info(): Promise<User | undefined> {
  const username = getCookie("username");
  if (typeof username === "undefined") {
    return undefined;
  }
  return get_user_info(getCookie("username")!);
}

async function get_user_info(username: string): Promise<User | undefined> {
  const response = await post_request(API_ROOT + "/user/" + username, {});
  if (!response.ok) return undefined;
  return await response.json();
}

async function login(username: string, password: string): Promise<Result> {
  const response = await post_request(API_ROOT + "/login", {
    username: username,
    password: password,
  });
  if (!response.ok) return "fail";
  setCookie("username", username);
  setCookie("token", await response.text());
  return "success";
}

async function sign_up(
  username: string,
  email: string,
  password: string
): Promise<Result> {
  const response = await post_request(API_ROOT + "/sign_up", {
    username: username,
    email: email,
    password: password,
  });
  if (!response.ok) return "fail";
  setCookie("username", username);
  setCookie("token", await response.text());
  return "success";
}

interface LeaderboardListing {
  username: string;
  score: number;
}

async function get_leaderboard(
  puzzle_id: number
): Promise<LeaderboardListing[]> {
  const response = await post_request(API_ROOT + "/leaderboard", {
    puzzle_id: puzzle_id,
  });
  const json = await response.json();
  return json.scores;
}

async function update_my_leaderboard(
  puzzle_id: number,
  score: number
): Promise<Result> {
  const response = await post_request(API_ROOT + "/update_score", {
    username: getCookie("username")!,
    puzzle_id: puzzle_id,
    score: score,
  });
  return response.ok ? "success" : "fail";
}

async function post_request(url: string, payload: unknown) {
  return await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookie("token"),
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(payload),
  });
}

async function update_my_currency(currency: number): Promise<Result> {
  const myself = await get_self_info();
  if (typeof myself === "undefined") return "fail";
  const response = await post_request(API_ROOT + "/user_update_ownership", {
    username: myself!.username,
    currency: currency,
    owned_vals: myself!.owned_vals,
  });
  if (response.ok) return "success";
  else return "fail";
}

async function update_my_ownership(quants: number[]) {
  const myself = await get_self_info();
  if (typeof myself === "undefined") return "fail";
  const response = await post_request(API_ROOT + "/user_update_ownership", {
    username: myself!.username,
    currency: myself!.currency,
    owned_vals: quants,
  });
  if (response.ok) return "success";
  else return "fail";
}

export {
  API_ROOT,
  get_leaderboard,
  get_self_info,
  get_user_info,
  login,
  sign_up,
  update_my_currency,
  update_my_leaderboard,
  update_my_ownership,
};
