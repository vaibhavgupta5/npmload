#!/usr/bin/env node
import inquirer from "inquirer";
import { execa } from "execa";
import ora from "ora";
import boxen from "boxen";
import figlet from "figlet";
import gradient from "gradient-string";
import chalk from "chalk";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import os from "os";

dotenv.config();

const spinner = ora();

const welcome = boxen(
  chalk.white("Welcome to the ") +
    chalk.yellowBright.bold("npmLoad ") +
    chalk.white("AI-powered npm installer by Vaibhav "),
  {
    padding: { top: 0, bottom: 0, left: 1, right: 1 },
    borderColor: "#ffff00",
    borderStyle: "round",
    align: "center",
  }
);

const banner = figlet.textSync("NPM\nLOAD", {
  font: "ANSI Shadow",
  horizontalLayout: "default",
  verticalLayout: "default",
});

const gradientText = gradient(["#ffff00ff", "#ffd500ff"])(banner);

const CONFIG_DIR = path.join(os.homedir(), '.npmload');
const API_KEY_FILE = path.join(CONFIG_DIR, 'config.json');

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function saveApiKey(apiKey) {
  ensureConfigDir();
  const config = {
    apiKey: apiKey,
    timestamp: Date.now()
  };
  fs.writeFileSync(API_KEY_FILE, JSON.stringify(config, null, 2));
}

function loadApiKey() {
  try {
    if (fs.existsSync(API_KEY_FILE)) {
      const config = JSON.parse(fs.readFileSync(API_KEY_FILE, 'utf8'));
      return config.apiKey;
    }
  } catch (error) {
  }
  return null;
}

async function validateApiKey(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    spinner.start("🔑 Validating API key...");
    await model.generateContent("test");
    spinner.succeed("✅ API key is valid!");
    return true;
  } catch (error) {
    spinner.fail("❌ Invalid API key!");
    return false;
  }
}

async function getValidApiKey() {
  // First check environment variables
  let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  
  if (apiKey) {
    if (await validateApiKey(apiKey)) {
      return apiKey;
    }
  }
  
  // Then check stored global config
  apiKey = loadApiKey();
  if (apiKey) {
    if (await validateApiKey(apiKey)) {
      return apiKey;
    }
  }
  
  // If no valid key found, ask user
  console.log(chalk.yellow("\n🔑 Gemini API key required for npmLoad to work."));
  console.log(chalk.gray("Get your free API key from: https://aistudio.google.com/app/apikey"));
  
  while (true) {
    const { inputApiKey } = await inquirer.prompt([
      {
        type: "password",
        name: "inputApiKey",
        message: "Enter your Gemini API key:",
        mask: "*"
      }
    ]);
    
    if (await validateApiKey(inputApiKey)) {
      saveApiKey(inputApiKey);
      console.log(chalk.green("✅ API key saved globally! You won't need to enter it again."));
      return inputApiKey;
    }
    
    console.log(chalk.red("❌ Invalid API key. Please try again."));
  }
}

async function getCommandsFromGemini(prompt, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const response = await model.generateContent(`
You are an expert AI installation assistant for Node.js developers. Your sole purpose is to interpret a user's request and output a pure, raw JSON array of exact shell commands to run. You must not include any explanations, markdown, or any text outside of the JSON array.

The commands must be in the correct logical sequence, using the most appropriate installer (npm, npx, or a framework-specific CLI) and appending "@latest" for initializations. You must handle both direct requests (e.g., "install express") and complex use-case descriptions (e.g., "build a SaaS dashboard").

A critical rule is to always recommend popular, actively maintained, and free open-source packages. For instance, when an AI library is needed, you must suggest "@google/generative-ai" for the free-tier Gemini API instead of paid alternatives. 

For web applications, UIs, or dashboards, you must default to setting up a Next.js project with "npx create-next-app@latest . --yes --use-npm" (the --yes flag skips prompts and --use-npm ensures npm is used for faster installation). For purely backend API servers, you can suggest an Express setup. Based on the use case, intelligently include common libraries: "mongoose" or "@prisma/client" for databases, "next-auth" for authentication, "tailwindcss" and "shadcn" for styling, and "zustand" for state management. Also if user asking for a single package of naming it no need to create a nextjs app first directly give for what he is asking.

IMPORTANT: Always use "npx shadcn@latest" for shadcn/ui commands, NOT "npx shadcn-ui@latest" which is deprecated.

Finally, automatically correct spelling mistakes in package names and replace any deprecated packages with their modern, popular alternatives.

Example 1:
User Prompt: install nextjs monogdb shadcn
Output: ["npx create-next-app@latest . --yes --use-npm", "npm install mongoose", "npx shadcn@latest init"]

Example 2:
User Prompt: I want to build an AI chat dashboard with authentication
Output: ["npx create-next-app@latest . --yes --use-npm", "npm install @google/generative-ai next-auth mongoose axios dotenv zustand", "npx shadcn@latest init"]

Example 3:
User Prompt: install shadcn and its button
Output: ["npx shadcn@latest init", "npx shadcn@latest add button"]

User prompt: "${prompt}"
`);

  const text = response.response.text().trim();

  const jsonStart = text.indexOf("[");
  const jsonEnd = text.lastIndexOf("]") + 1;
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Gemini response did not contain valid JSON:\n" + text);
  }

  const commands = JSON.parse(text.slice(jsonStart, jsonEnd));
  if (!Array.isArray(commands))
    throw new Error("Parsed response is not an array.");

  return commands;
}

async function runCommandsSequentially(commands, folderName) {
  let modifiedCommands = commands;
  if (folderName && folderName !== ".") {
    modifiedCommands = commands.map(cmd => {
      if (cmd.includes("create-next-app") && cmd.includes(".")) {
        return cmd.replace(/\s+\.\s*$/, ` ${folderName}`);
      }
      if (cmd.includes("create-") && cmd.includes(".")) {
        return cmd.replace(/\s+\.\s*$/, ` ${folderName}`);
      }
      return cmd;
    });
  }

  const shouldCreateFolder = folderName && folderName !== "." && 
    !commands.some(cmd => cmd.includes("create-") && cmd.includes("."));

  if (shouldCreateFolder) {
    spinner.start(`Creating folder: ${folderName}`);
    try {
      await execa("mkdir", [folderName], { stdio: "inherit" });
      spinner.succeed(`✅ Created folder: ${folderName}`);
      
      spinner.start(`Changing to directory: ${folderName}`);
      process.chdir(folderName);
      spinner.succeed(`✅ Changed to directory: ${folderName}`);
    } catch (err) {
      if (err.stderr && err.stderr.includes("already exists")) {
        spinner.warn(`⚠️  Folder ${folderName} already exists, continuing...`);
        process.chdir(folderName);
      } else {
        spinner.fail(`❌ Failed to create/navigate to folder: ${folderName}`);
        throw err;
      }
    }
  }

  for (let i = 0; i < modifiedCommands.length; i++) {
    const cmd = modifiedCommands[i];
    const progress = `[${i + 1}/${modifiedCommands.length}]`;
    const percentage = Math.round(((i + 1) / modifiedCommands.length) * 100);
    
    spinner.start(`${progress} Running: ${chalk.cyan(cmd)}`);
    const [cmdName, ...args] = cmd.split(" ");
    
    try {
      if (cmdName === 'npm' || cmdName === 'npx') {
        spinner.stop();
        console.log(chalk.yellow(`${progress} Executing: ${cmd}`));
        console.log(chalk.gray('─'.repeat(50)));
        
        await execa(cmdName, args, { 
          stdio: "inherit",
          preferLocal: true 
        });
        
        console.log(chalk.gray('─'.repeat(50)));
        console.log(chalk.green(`✅ ${progress} Completed: ${cmd} (${percentage}% done)`));
      } else {
        await execa(cmdName, args, { stdio: "inherit" });
        spinner.succeed(`✅ ${progress} Done: ${cmd} (${percentage}% done)`);
      }
    } catch (err) {
      spinner.fail(`❌ ${progress} Failed: ${cmd}`);
      throw err;
    }
  }
}

async function main() {
  console.log("\n" + welcome + "\n");
  console.log(gradientText);

  // Validate API key first before anything else
  const apiKey = await getValidApiKey();
  console.log(chalk.green("\n🚀 Ready to install packages!\n"));

  const { folderName } = await inquirer.prompt([
    {
      type: "input",
      name: "folderName",
      message: "Enter folder name (or '.' for current folder):",
      default: ".",
    },
  ]);

  const { installPrompt } = await inquirer.prompt([
    {
      type: "input",
      name: "installPrompt",
      message: "What do you want to install? (e.g., nextjs mongodb shadcn):",
    },
  ]);

  spinner.start("🔍 Asking Gemini for install commands...");
  const commands = await getCommandsFromGemini(installPrompt, apiKey);
  spinner.succeed("✅ Got commands from Gemini!");

  console.log(chalk.yellow("\nCommands to run:\n"));
  commands.forEach((c, i) => console.log(`${i + 1}. ${chalk.green(c)}`));

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Proceed with installation?",
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.gray("Cancelled."));
    process.exit(0);
  }

  await runCommandsSequentially(commands, folderName);

  console.log(
    chalk.greenBright("\n🎉 All installations completed successfully!\n")
  );
}

main().catch((err) => {
  spinner.fail("Unexpected error occurred.");
  console.error(chalk.red(err.message));
  process.exit(1);
});
