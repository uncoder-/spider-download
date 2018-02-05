import chalk from "chalk";
export function Tlog() {
  const args = Array.from(arguments).join(" ");
  console.log(chalk.red("terminal console: ", args));
}

export default {
  Tlog
};
