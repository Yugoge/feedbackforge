import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getEmployeeById } from "@/lib/employees";
import { buildSystemPrompt } from "@/lib/prompts";
import type { Employee } from "@/lib/types";

// IMPORTANT: do NOT export `runtime = 'edge'`. @anthropic-ai/sdk targets Node
// runtime; edge would break the SDK transport (architect RISK-10).

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  employeeId: string;
  messages: IncomingMessage[];
};

type MinimaxConfig = {
  apiKey: string;
  baseURL: string;
  model: string;
};

async function parseBody(request: Request): Promise<ChatRequest | null> {
  try {
    return (await request.json()) as ChatRequest;
  } catch (err) {
    console.error("[/api/chat] Invalid JSON body:", err);
    return null;
  }
}

function readMinimaxConfig(): MinimaxConfig | null {
  const apiKey = process.env.MINIMAX_AUTH_TOKEN;
  const baseURL = process.env.MINIMAX_BASE_URL;
  const model = process.env.MINIMAX_MODEL;
  if (!apiKey || !baseURL || !model) return null;
  return { apiKey, baseURL, model };
}

// Spec 5.4 step 3: if inbound messages array is empty, send a single user
// message so the assistant emits the Phase-1 opening greeting.
function prepareMessages(inbound: IncomingMessage[]): IncomingMessage[] {
  if (inbound.length > 0) return inbound;
  return [
    {
      role: "user",
      content: "Start the feedback session. Send your opening greeting.",
    },
  ];
}

async function callMinimax(
  config: MinimaxConfig,
  employee: Employee,
  outbound: IncomingMessage[],
): Promise<string> {
  const client = new Anthropic({ apiKey: config.apiKey, baseURL: config.baseURL });
  const response = await client.messages.create({
    model: config.model,
    system: buildSystemPrompt(employee),
    messages: outbound,
    max_tokens: 1024,
  });
  return response.content
    .filter(
      (block): block is { type: "text"; text: string } => block.type === "text",
    )
    .map((block) => block.text)
    .join("");
}

function findEmployeeOrNull(employeeId: unknown): Employee | undefined {
  if (typeof employeeId !== "string") return undefined;
  return getEmployeeById(employeeId);
}

async function generateContent(
  body: ChatRequest,
  employee: Employee,
  config: MinimaxConfig,
): Promise<NextResponse> {
  const inbound = Array.isArray(body.messages) ? body.messages : [];
  const outbound = prepareMessages(inbound);
  try {
    const content = await callMinimax(config, employee, outbound);
    return NextResponse.json({ content });
  } catch (err) {
    console.error("[/api/chat] MiniMax/Anthropic API failure:", err);
    return NextResponse.json(
      { error: "Failed to generate response. Please try again." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = await parseBody(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const employee = findEmployeeOrNull(body.employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 400 });
  }
  const config = readMinimaxConfig();
  if (!config) {
    console.error("[/api/chat] Missing MiniMax env vars (token / base URL / model)");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }
  return generateContent(body, employee, config);
}
