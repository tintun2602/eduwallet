#!/usr/bin/env node
import { Command } from 'commander';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import eduwallet from 'eduwallet-sdk'
import { subscribeUniversity } from './interact';


const program = new Command();

console.log(figlet.textSync("EduWallet"));

program
  .version("1.0.0")
  .description("A simple CLI to test EduWallet SDK")
  .option("-s, --sub  <value>", "Subscribe the university to the system")
  .option("-m, --mkdir <value>", "Create a directory")
  .option("-t, --touch <value>", "Create a file")
  .parse(process.argv);

const options = program.opts();

if (options.sub) {
  const jsonData = parseJson(options.sub);

  if (jsonData && typeof jsonData === 'object' && 'name' in jsonData && 'country' in jsonData && 'shortName' in jsonData) {
    subscribeUniversity(jsonData.name, jsonData.country, jsonData.shortName);
  } else {
    console.error("University JSON format error");
  }
}

function parseJson(filePath: string): any {
  try {
    const resolvedPath = path.resolve(filePath);
    const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    console.log(JSON.stringify(jsonData, null, 2));
    return jsonData;
  } catch (error) {
    console.error(`Error parsing JSON file: ${error}`);
  }
}